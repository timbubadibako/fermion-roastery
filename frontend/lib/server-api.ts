import { headers } from "next/headers";

const LOCAL_API_PATTERN = /(^|\/\/)(localhost|127\.0\.0\.1)(:|\/|$)/;

export const normalizeApiBaseUrl = (baseUrl: string) =>
  baseUrl.endsWith("/api") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/api`;

export const isLocalApiUrl = (baseUrl?: string) =>
  Boolean(baseUrl && LOCAL_API_PATTERN.test(baseUrl));

export async function getRequestOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");

  if (!host) return null;

  const protocol =
    requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export async function getServerApiBaseUrl() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (configuredApiUrl && (process.env.NODE_ENV !== "production" || !isLocalApiUrl(configuredApiUrl))) {
    return normalizeApiBaseUrl(configuredApiUrl);
  }

  const requestOrigin = await getRequestOrigin();
  if (requestOrigin) return `${requestOrigin}/api`;

  return normalizeApiBaseUrl(configuredApiUrl || "http://localhost:3001");
}

export function getConfiguredApiBaseUrl(fallbackOrigin?: string) {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (configuredApiUrl && (process.env.NODE_ENV !== "production" || !isLocalApiUrl(configuredApiUrl))) {
    return normalizeApiBaseUrl(configuredApiUrl);
  }

  if (fallbackOrigin) return `${fallbackOrigin.replace(/\/$/, "")}/api`;

  return normalizeApiBaseUrl(configuredApiUrl || "http://localhost:3001");
}
