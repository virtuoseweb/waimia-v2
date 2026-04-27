/**
 * Diagnostic · GET /api/diag-resend
 * Importe lib/resend pour identifier si CET import plante au bundle.
 */
import { sendEmail, EMAIL_FROM } from "../../lib/resend";

export const prerender = false;

export const GET = () =>
  Response.json({
    ok: true,
    test: "import lib/resend",
    hasFunc: typeof sendEmail === "function",
    emailFrom: EMAIL_FROM ? "set" : "missing",
  });
