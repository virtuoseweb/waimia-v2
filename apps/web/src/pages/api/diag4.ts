export const prerender = false;

export async function POST() {
  return Response.json({ ok: true, test: "POST function declaration" });
}
