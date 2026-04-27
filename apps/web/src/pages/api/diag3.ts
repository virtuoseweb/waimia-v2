import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  return Response.json({ ok: true, test: "POST async APIRoute typed", method: request.method });
};
