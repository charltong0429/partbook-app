const UPSTREAM_URL = "https://differpower.vercel.app/api/external/findings";

export function buildUpstreamUrl({ since, limit } = {}) {
  const url = new URL(UPSTREAM_URL);
  if (since) url.searchParams.set("since", since);
  if (limit) url.searchParams.set("limit", limit);
  return url.toString();
}

/**
 * Server-only: calls Differ Market Intel's partner-read API for approved
 * market findings. `secret` must come from process.env.PARTNER_READ_SECRET
 * and must never reach the browser — this function has no browser-safe mode.
 */
export async function fetchExternalFindings({ secret, since, limit, fetchImpl = fetch } = {}) {
  if (!secret) {
    const error = new Error("PARTNER_READ_SECRET is not configured");
    error.status = 500;
    throw error;
  }

  let response;
  try {
    response = await fetchImpl(buildUpstreamUrl({ since, limit }), {
      headers: { "x-partner-token": secret },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (cause) {
    const error = new Error("Failed to reach Differ Market Intel");
    error.status = 502;
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`Differ Market Intel returned ${response.status}`);
    error.status = 502;
    throw error;
  }

  return response.json();
}
