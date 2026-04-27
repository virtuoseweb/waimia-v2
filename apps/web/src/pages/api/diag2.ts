import { EMAIL_FROM, EMAIL_INTERNAL_TO } from "../../lib/resend";

export const prerender = false;

export const GET = () =>
  Response.json({
    ok: true,
    test: "import lib/resend (post refactor fetch)",
    hasFrom: !!EMAIL_FROM,
    hasInternal: !!EMAIL_INTERNAL_TO,
  });
