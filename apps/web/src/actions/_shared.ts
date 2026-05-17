import type { AstroCookies } from "astro";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const MSGS = {
  fr: {
    missing_email: "Email manquant ou invalide.",
    missing_fields: "Champs requis manquants.",
    invalid_email: "Email invalide.",
    invalid_request: "Requête invalide.",
    send_failed: "Erreur lors de l'envoi. Veuillez réessayer.",
    too_many_requests: "Trop de tentatives. Veuillez patienter.",
    invalid_body: "Corps de la requête invalide.",
  },
  en: {
    missing_email: "Missing or invalid email.",
    missing_fields: "Required fields missing.",
    invalid_email: "Invalid email address.",
    invalid_request: "Invalid request.",
    send_failed: "Send error. Please try again.",
    too_many_requests: "Too many attempts. Please wait.",
    invalid_body: "Invalid request body.",
  },
} as const;

type Lang = keyof typeof MSGS;
type MsgKey = keyof typeof MSGS.fr;

export function msg(key: MsgKey, lang: Lang = "fr"): string {
  return (MSGS[lang] ?? MSGS.fr)[key];
}

export function maskEmail(email: string): string {
  return email.replace(/(?<=.{3}).(?=.*@)/g, "*");
}

export function logSubmission({
  ip,
  action,
  email,
}: {
  ip: string;
  action: string;
  email: string;
}): void {
  console.log(
    JSON.stringify({ ts: new Date().toISOString(), action, ip, email: maskEmail(email) }),
  );
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

// Shared in-memory store — une seule Map pour toutes les actions (clé = `${action}:${ip}`)
const _rlMap = new Map<string, { n: number; resetAt: number }>();

export async function rateLimit({
  ip,
  action,
  max,
  windowMs,
}: {
  ip: string;
  action: string;
  max: number;
  windowMs: number;
}): Promise<{ ok: boolean }> {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const redis = new Redis({ url, token });
    const windowSec = Math.round(windowMs / 1000);
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
    });
    const { success } = await rl.limit(`${action}:${ip}`);
    return { ok: success };
  }

  const key = `${action}:${ip}`;
  const now = Date.now();
  const e = _rlMap.get(key);
  if (!e || e.resetAt < now) {
    _rlMap.set(key, { n: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (e.n >= max) return { ok: false };
  e.n++;
  return { ok: true };
}

export function setSubmittedCookie(
  cookies: AstroCookies,
  source: "contact" | "newsletter" | "academy" | "devis" | "lead-magnet",
): void {
  cookies.set("_waimia_submitted", JSON.stringify({ source, at: Date.now() }), {
    httpOnly: true,
    // secure: true casse astro dev (localhost non-HTTPS) — conditionner sur PROD
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 600,
    path: "/bienvenue",
  });
}
