import { fetchExternalFindings } from "../lib/findings-proxy.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  res.setHeader("cache-control", "no-store");

  try {
    const data = await fetchExternalFindings({
      secret: process.env.PARTNER_READ_SECRET,
      since: typeof req.query.since === "string" ? req.query.since : undefined,
      limit: typeof req.query.limit === "string" ? req.query.limit : undefined,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(error.status ?? 500).json({ error: "findings_unavailable" });
  }
}
