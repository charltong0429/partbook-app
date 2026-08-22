import test from "node:test";
import assert from "node:assert/strict";
import { buildUpstreamUrl, fetchExternalFindings } from "../lib/findings-proxy.js";

test("buildUpstreamUrl includes since and limit when provided", () => {
  const url = new URL(buildUpstreamUrl({ since: "2026-08-01T00:00:00.000Z", limit: 5 }));
  assert.equal(url.origin + url.pathname, "https://differpower.vercel.app/api/external/findings");
  assert.equal(url.searchParams.get("since"), "2026-08-01T00:00:00.000Z");
  assert.equal(url.searchParams.get("limit"), "5");
});

test("buildUpstreamUrl omits since/limit when absent", () => {
  const url = new URL(buildUpstreamUrl());
  assert.equal(url.searchParams.has("since"), false);
  assert.equal(url.searchParams.has("limit"), false);
});

test("fetchExternalFindings rejects with 500 when secret is missing", async () => {
  await assert.rejects(
    () => fetchExternalFindings({ secret: undefined, fetchImpl: async () => { throw new Error("should not be called"); } }),
    (error) => {
      assert.equal(error.status, 500);
      return true;
    },
  );
});

test("fetchExternalFindings sends the partner token header and returns parsed JSON", async () => {
  let receivedHeaders;
  const fetchImpl = async (url, init) => {
    receivedHeaders = init.headers;
    return { ok: true, json: async () => ({ findings: [{ id: "1" }] }) };
  };

  const data = await fetchExternalFindings({ secret: "test-secret", fetchImpl });
  assert.equal(receivedHeaders["x-partner-token"], "test-secret");
  assert.deepEqual(data, { findings: [{ id: "1" }] });
});

test("fetchExternalFindings rejects with 502 when upstream responds non-ok", async () => {
  const fetchImpl = async () => ({ ok: false, status: 403 });
  await assert.rejects(
    () => fetchExternalFindings({ secret: "test-secret", fetchImpl }),
    (error) => {
      assert.equal(error.status, 502);
      return true;
    },
  );
});

test("fetchExternalFindings rejects with 502 when the request throws", async () => {
  const fetchImpl = async () => { throw new Error("network down"); };
  await assert.rejects(
    () => fetchExternalFindings({ secret: "test-secret", fetchImpl }),
    (error) => {
      assert.equal(error.status, 502);
      return true;
    },
  );
});
