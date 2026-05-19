const defaultApiBase = "";

const normalizedApiBase = (process.env.NEXT_PUBLIC_API_URL || defaultApiBase).replace(/\/$/, "");

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`apiUrl(path) expects an absolute path. Received: "${path}"`);
  }

  return `${normalizedApiBase}${path}`;
}
