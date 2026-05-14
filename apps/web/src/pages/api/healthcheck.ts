export const prerender = false;

const version = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.COMMIT_SHA ?? "dev").slice(0, 7);

export const GET = () =>
  Response.json({ ok: true, ts: new Date().toISOString(), version });
