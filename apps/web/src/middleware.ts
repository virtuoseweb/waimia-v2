import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const existingVariant = context.cookies.get("waimia_variant")?.value;

  if (!existingVariant) {
    const variant = Math.random() < 0.5 ? "a" : "b";
    context.cookies.set("waimia_variant", variant, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      sameSite: "lax",
      secure: import.meta.env.PROD,
    });
    context.locals.variant = variant;
  } else {
    context.locals.variant = existingVariant as "a" | "b";
  }

  return next();
});
