import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
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
const determinismCheck = process.argv.includes("--determinism-check");
// Bumped after adding /explore/ (Phase E.2 discovery atlas).
// If inventory drifts, update this number only after reviewing the new route list, then run test:visual:update.
const expectedRouteCount = Number(process.env.VISUAL_EXPECTED_ROUTES || 58);
const maxDiffPixelRatio = 0.002;
/** Bounded post-readiness settle (ms). Deterministic; not a substitute for readiness. */
const SETTLE_MS = 100;

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

/**
 * Injected only when serving HTML with ?__visual_regression=1.
 * Production pages without that query are unchanged.
 *
 * Neutralizes decorative ambient layers that freeze at nondeterministic
 * animation keyframes even after animation:none (body sacred geometry +
 * glow pulse). Does not hide semantic content (headings, form, links).
 */
const visualRegressionOverlay = `
<style id="visual-regression-overlay">
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
  /* Decorative ambient only — not layout or copy */
  body::before,
  body::after {
    display: none !important;
    content: none !important;
    animation: none !important;
    opacity: 0 !important;
  }
  .royal-hero::before {
    animation: none !important;
    transition: none !important;
    filter: none !important;
  }
  .panel,
  .royal-header,
  header.royal-header {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
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

/**
 * Wait until the document is visually ready for a deterministic screenshot:
 * - document.readyState complete
 * - document.fonts.ready (when available)
 * - in-document <img> elements finished (complete; broken optional images do not block)
 * - short bounded settle for layout/paint
 */
async function waitForVisualReady(page) {
  await page.waitForFunction(() => document.readyState === "complete", null, { timeout: 15_000 });

  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {
        /* fonts API failure must not abort capture */
      }
    }

    const images = Array.from(document.images || []);
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            // Safety: do not hang forever on stalled optional assets
            setTimeout(done, 5_000);
          }),
      ),
    );
  });

  await sleep(SETTLE_MS);
}

async function captureViewport(browser, route, viewport) {
  const targetUrl = `http://127.0.0.1:4180${route}?__visual_regression=1`;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  try {
    await page.goto(targetUrl, { waitUntil: "load", timeout: 30_000 });
    await waitForVisualReady(page);
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
      animations: "disabled",
      caret: "hide",
    });
    return screenshot;
  } finally {
    await context.close();
  }
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

/** Double-capture selected routes; report current-vs-current ratios (no baseline write). */
async function runDeterminismCheck(browser) {
  const targets = [
    { route: "/contact/", viewport: viewports.find((v) => v.name === "mobile") },
    { route: "/contact/", viewport: viewports.find((v) => v.name === "desktop") },
    { route: "/blueprint/", viewport: viewports.find((v) => v.name === "desktop") },
    { route: "/blueprint/", viewport: viewports.find((v) => v.name === "mobile") },
  ];
  const outDir = path.join(artifactRoot, "determinism");
  await mkdir(outDir, { recursive: true });
  let anyFail = false;

  for (const { route, viewport } of targets) {
    const a = await captureViewport(browser, route, viewport);
    const b = await captureViewport(browser, route, viewport);
    const comparison = compareScreenshots(a, b);
    const label = `${viewport.name} ${route}`;
    const pct = (comparison.differenceRatio * 100).toFixed(4);
    const name = `${viewport.name}-${routeName(route)}`;
    await writeFile(path.join(outDir, `${name}.a.png`), a);
    await writeFile(path.join(outDir, `${name}.b.png`), b);
    if (comparison.differenceRatio > maxDiffPixelRatio) {
      anyFail = true;
      await writeFile(path.join(outDir, `${name}.diff.png`), comparison.diffBuffer);
      process.stderr.write(`DETERMINISM FAIL ${label}: ${pct}% changed (threshold ${(maxDiffPixelRatio * 100).toFixed(1)}%)\n`);
    } else {
      process.stdout.write(`DETERMINISM PASS ${label}: ${pct}% changed\n`);
    }
  }

  if (anyFail) {
    process.exitCode = 1;
    process.stderr.write(`Determinism artifacts: ${outDir}\n`);
  } else {
    process.stdout.write(`\nDeterminism check passed for contact + blueprint (current-vs-current).\n`);
  }
}

async function run() {
  const routes = await discoverRoutes(staticRoot);
  if (!determinismCheck && routes.length !== expectedRouteCount) {
    throw new Error(
      `Route inventory changed: expected ${expectedRouteCount} routes, found ${routes.length}. ` +
        `Review new routes, set VISUAL_EXPECTED_ROUTES or update expectedRouteCount, then run test:visual:update.`,
    );
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
  const browser = await chromium.launch({
    executablePath: browserExecutable,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  try {
    if (determinismCheck) {
      await runDeterminismCheck(browser);
      return;
    }

    const failures = [];
    let checked = 0;

    for (const viewport of viewports) {
      const baselineDirectory = path.join(baselineRoot, viewport.name);
      const artifactDirectory = path.join(artifactRoot, viewport.name);
      const temporaryDirectory = path.join(temporaryRoot, viewport.name);
      await mkdir(baselineDirectory, { recursive: true });
      await mkdir(artifactDirectory, { recursive: true });
      await mkdir(temporaryDirectory, { recursive: true });

      for (const route of routes) {
        const name = routeName(route);
        const baselinePath = path.join(baselineDirectory, `${name}.png`);
        const actualPath = path.join(artifactDirectory, `${name}.actual.png`);
        const diffPath = path.join(artifactDirectory, `${name}.diff.png`);
        const actual = await captureViewport(browser, route, viewport);
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

    if (failures.length > 0) {
      process.stderr.write(`\nVisual regression failures (${failures.length}/${checked} captures):\n${failures.map((failure) => `- ${failure}`).join("\n")}\n`);
      process.stderr.write(`Diff artifacts: ${artifactRoot}\n`);
      process.exitCode = 1;
      return;
    }

    process.stdout.write(`\nVisual regression suite passed: ${checked} captures across ${routes.length} routes and ${viewports.length} viewports.\n`);
  } finally {
    await browser.close();
    await rm(temporaryRoot, { recursive: true, force: true });
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((error) => {
  process.stderr.write(`Visual regression runner failed: ${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
