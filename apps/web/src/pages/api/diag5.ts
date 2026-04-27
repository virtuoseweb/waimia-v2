import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  return Response.json({ ok: true, test: "ALL handler", method: request.method });
};
