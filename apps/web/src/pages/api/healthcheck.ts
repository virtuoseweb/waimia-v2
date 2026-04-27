/**
 * API · GET /api/healthcheck · diagnostic minimal
 * Pas d'imports externes pour isoler les problèmes de bundling.
 */
export const prerender = false;

export const GET = () =>
  Response.json({ ok: true, ts: new Date().toISOString() });
