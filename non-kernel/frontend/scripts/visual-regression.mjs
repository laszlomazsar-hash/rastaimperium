import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDirectory, "..");
const repositoryRoot = path.resolve(frontendRoot, "../..");
const staticRoot = path.join(repositoryRoot, "backend/static");
const baselineRoot = path.join(frontendRoot, "tests/visual-baselines");
const artifactRoot = path.join(frontendRoot, "visual-regression/artifacts");
const temporaryRoot = path.join(frontendRoot, "visual-regression/.tmp");
const updateBaselines = process.argv.includes("--update");
const expectedRouteCount = 40;
const maxDiffPixelRatio = 0.002;

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

const visualRegressionOverlay = `
<style id="visual-regression-overlay">
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
  .opacity-0 { opacity: 1 !important; }
  .translate-y-8 { transform: none !important; }
</style>
<script>
  Math.random = () => 0.5;
  Date.now = () => 1704067200000;
</script>`;

const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function routeName(route) {
  return route === "/" ? "home" : route.slice(1, -1).replaceAll("/", "--");
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function discoverRoutes(directory, root = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const collected = [];

  for (const entry of entries) {
    if (entry.name === "_next" || entry.name === "shared" || entry.name.startsWith(".")) continue;
    const target = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collected.push(...(await discoverRoutes(target, root)));
      continue;
    }

    if (entry.name === "index.html") {
      const relativeDirectory = path.relative(root, path.dirname(target));
      collected.push(relativeDirectory === "" ? "/" : `/${relativeDirectory.split(path.sep).join("/")}/`);
    }
  }

  return collected.sort((left, right) => left.localeCompare(right));
}

function safeStaticPath(requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const normalised = path.posix.normalize(decoded).replace(/^\/+/, "");
  return normalised.startsWith("..") || normalised.includes("/../") ? null : normalised;
}

async function isFile(candidate) {
  try {
    return (await stat(candidate)).isFile();
  } catch {
    return false;
  }
}

function startStaticServer() {
  const server = createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const safePath = safeStaticPath(requestUrl.pathname);
    if (safePath === null) {
      response.writeHead(400).end("Bad request");
      return;
    }

    const candidates = safePath === ""
      ? [path.join(staticRoot, "index.html")]
      : [path.join(staticRoot, safePath), path.join(staticRoot, safePath, "index.html")];
    const filePath = (await Promise.all(candidates.map(async (candidate) => ((await isFile(candidate)) ? candidate : null)))).find(Boolean);

    if (!filePath) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": contentTypes[extension] ?? "application/octet-stream",
    });

    if (extension === ".html" && requestUrl.searchParams.get("__visual_regression") === "1") {
      const html = await readFile(filePath, "utf8");
      response.end(html.replace("</head>", `${visualRegressionOverlay}</head>`));
      return;
    }

    createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(4180, "127.0.0.1", () => resolve(server));
  });
}

function stopCaptureProcess(child) {
  if (child.exitCode === null) child.kill("SIGKILL");
}

async function captureViewport(browserExecutable, route, viewport, outputPath) {
  await rm(outputPath, { force: true });
  const targetUrl = `http://127.0.0.1:4180${route}?__visual_regression=1`;
  const child = spawn(browserExecutable, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-extensions",
    "--disable-notifications",
    "--hide-scrollbars",
    `--window-size=${viewport.width},${viewport.height}`,
    `--screenshot=${outputPath}`,
    targetUrl,
  ], { stdio: "ignore" });

  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (await isFile(outputPath)) {
      await sleep(150);
      const screenshot = await readFile(outputPath);
      stopCaptureProcess(child);
      return screenshot;
    }
    if (child.exitCode !== null) break;
    await sleep(100);
  }

  stopCaptureProcess(child);
  throw new Error(`Timed out capturing ${route} at ${viewport.name}`);
}

function compareScreenshots(baselineBuffer, actualBuffer) {
  const baseline = PNG.sync.read(baselineBuffer);
  const actual = PNG.sync.read(actualBuffer);

  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    return {
      differenceRatio: 1,
      diffBuffer: actualBuffer,
      reason: `dimension mismatch: expected ${baseline.width}×${baseline.height}, received ${actual.width}×${actual.height}`,
    };
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const changedPixels = pixelmatch(baseline.data, actual.data, diff.data, baseline.width, baseline.height, {
    threshold: 0.1,
    includeAA: false,
  });

  return {
    differenceRatio: changedPixels / (baseline.width * baseline.height),
    diffBuffer: PNG.sync.write(diff),
    reason: null,
  };
}

async function run() {
  const routes = await discoverRoutes(staticRoot);
  if (routes.length !== expectedRouteCount) {
    throw new Error(`Route inventory changed: expected ${expectedRouteCount} routes, found ${routes.length}. Update the approved route count before regenerating baselines.`);
  }

  const browserExecutable = process.env.VISUAL_CHROMIUM_EXECUTABLE || chromium.executablePath();
  if (!(await isFile(browserExecutable))) {
    throw new Error("Playwright Chromium is not installed. Run `npx playwright install chromium` before the visual suite.");
  }

  if (updateBaselines) await rm(baselineRoot, { recursive: true, force: true });
  await rm(artifactRoot, { recursive: true, force: true });
  await rm(temporaryRoot, { recursive: true, force: true });
  await mkdir(baselineRoot, { recursive: true });
  await mkdir(temporaryRoot, { recursive: true });

  const server = await startStaticServer();
  const failures = [];
  let checked = 0;

  try {
    for (const viewport of viewports) {
      const baselineDirectory = path.join(baselineRoot, viewport.name);
      const artifactDirectory = path.join(artifactRoot, viewport.name);
      const temporaryDirectory = path.join(temporaryRoot, viewport.name);
      await mkdir(baselineDirectory, { recursive: true });
      await mkdir(artifactDirectory, { recursive: true });
      await mkdir(temporaryDirectory, { recursive: true });

      for (const route of routes) {
        const name = routeName(route);
        const capturePath = path.join(temporaryDirectory, `${name}.png`);
        const baselinePath = path.join(baselineDirectory, `${name}.png`);
        const actualPath = path.join(artifactDirectory, `${name}.actual.png`);
        const diffPath = path.join(artifactDirectory, `${name}.diff.png`);
        const actual = await captureViewport(browserExecutable, route, viewport, capturePath);
        checked += 1;

        if (updateBaselines) {
          await writeFile(baselinePath, actual);
          process.stdout.write(`UPDATED ${viewport.name.padEnd(7)} ${route}\n`);
          continue;
        }

        let baseline;
        try {
          baseline = await readFile(baselinePath);
        } catch {
          failures.push(`${viewport.name} ${route}: missing approved baseline`);
          await writeFile(actualPath, actual);
          continue;
        }

        const comparison = compareScreenshots(baseline, actual);
        if (comparison.differenceRatio > maxDiffPixelRatio) {
          failures.push(`${viewport.name} ${route}: ${(comparison.differenceRatio * 100).toFixed(3)}% changed${comparison.reason ? ` (${comparison.reason})` : ""}`);
          await writeFile(actualPath, actual);
          await writeFile(diffPath, comparison.diffBuffer);
        } else {
          process.stdout.write(`PASS    ${viewport.name.padEnd(7)} ${route}\n`);
        }
      }
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
    await new Promise((resolve) => server.close(resolve));
  }

  if (failures.length > 0) {
    process.stderr.write(`\nVisual regression failures (${failures.length}/${checked} captures):\n${failures.map((failure) => `- ${failure}`).join("\n")}\n`);
    process.stderr.write(`Diff artifacts: ${artifactRoot}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`\nVisual regression suite passed: ${checked} captures across ${routes.length} routes and ${viewports.length} viewports.\n`);
}

run().catch((error) => {
  process.stderr.write(`Visual regression runner failed: ${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
