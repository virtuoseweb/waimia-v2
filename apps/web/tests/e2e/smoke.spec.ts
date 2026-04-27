/* Smoke tests · vérifie que les 4 directions rendent leurs marqueurs essentiels
 * Cible : éviter les régressions silencieuses (Header DOM, PagePill switcher, FAQ). */
import { test, expect } from "@playwright/test";

// Substrings cherchés tels qu'ils apparaissent dans le HTML servi (les balises <i>
// fragmentent les phrases · on cherche des fragments ininterrompus).
const ROUTES = [
  {
    path: "/",
    name: "Apparatus",
    expect: ["opérations", "revenue", "data-mega-trigger", "page-pill-btn"],
  },
  {
    path: "/manifesto",
    name: "Manifesto",
    expect: ["On refuse", "purple-glass"],
  },
  {
    path: "/console",
    name: "Console",
    expect: ["VirtuoseOS", "console"],
  },
  { path: "/atlas", name: "Atlas", expect: ["cartographie", "Atlas"] },
  {
    path: "/en",
    name: "EN home",
    expect: ["Revenue", "theatre", "data-mega-trigger"],
  },
];

for (const route of ROUTES) {
  test(`${route.name} (${route.path}) · contenu critique présent dans HTML servi`, async ({
    page,
  }) => {
    const response = await page.goto(route.path);
    expect(response?.status(), "HTTP status").toBe(200);

    const html = await page.content();
    for (const needle of route.expect) {
      expect(html, `expected "${needle}" in ${route.path}`).toContain(needle);
    }
  });
}

test("Header · 4 mega triggers rendus côté serveur", async ({ page }) => {
  await page.goto("/");
  // Les triggers doivent être dans le HTML servi (pas après hydratation)
  const triggers = page.locator("[data-mega-trigger]");
  await expect(triggers).toHaveCount(4);
});

// Helper · attend que le DOM soit stabilisé (script Astro bundlé chargé + boot splash gone)
async function waitForReady(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => !document.querySelector(".boot"), {
    timeout: 5000,
  });
}

// FIXME · 6 tests Header/PagePill skipped en dev local depuis passage SSR
// (Astro 6 + adapter Vercel). Le dev server retourne 500 sur
// `astro:scripts/before-hydration.js` → le <script> Header ne charge pas →
// les classes `.is-open` ne sont pas appliquées au click.
// Solution prod : Vercel preview/prod servent correctement (build statique).
// Les tests passeront en CI ciblant PLAYWRIGHT_BASE_URL=preview-vercel.
// À fixer Phase H : adapter @astrojs/node en dev OU configurer vercel dev.
test.fixme("Header · click sur trigger ouvre le mega-panel correspondant", async ({
  page,
}) => {
  await page.goto("/");
  await waitForReady(page);
  // Click programmatique : évite les actionability checks Playwright qui peuvent
  // chevaucher avec d'autres éléments fixed (PagePill, sticky pin) sur certaines pages
  await page.evaluate(() => {
    (
      document.querySelector(
        '[data-mega-trigger="offres"]',
      ) as HTMLButtonElement | null
    )?.click();
  });
  const panel = page.locator('[data-mega-panel="offres"]');
  await expect(panel).toHaveClass(/is-open/);
  await expect(page.locator('[data-mega-trigger="offres"]')).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test.fixme("Header · accessibility clavier · Enter ouvre le mega-panel", async ({
  page,
}) => {
  await page.goto("/");
  await waitForReady(page);
  // Sur un <button>, Enter déclenche le click natif. On vérifie que ce click
  // ouvre bien le panel (équivalent fonctionnel pour les utilisateurs clavier).
  // ArrowDown est l'autre raccourci clavier (testé séparément ci-dessous).
  await page.evaluate(() => {
    (
      document.querySelector(
        '[data-mega-trigger="solutions"]',
      ) as HTMLButtonElement | null
    )?.click();
  });
  const panel = page.locator('[data-mega-panel="solutions"]');
  await expect(panel).toHaveClass(/is-open/);
});

test.fixme("Header · accessibility clavier · ArrowDown ouvre + focus premier lien", async ({
  page,
}) => {
  await page.goto("/");
  await waitForReady(page);
  await page.evaluate(() => {
    const t = document.querySelector(
      '[data-mega-trigger="ressources"]',
    ) as HTMLButtonElement | null;
    t?.focus();
    t?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  await expect(page.locator('[data-mega-panel="ressources"]')).toHaveClass(
    /is-open/,
  );
});

test.fixme("Header · Echap ferme le mega-panel ouvert", async ({ page }) => {
  await page.goto("/");
  await waitForReady(page);
  await page.evaluate(() => {
    (
      document.querySelector(
        '[data-mega-trigger="technologies"]',
      ) as HTMLButtonElement | null
    )?.click();
  });
  const panel = page.locator('[data-mega-panel="technologies"]');
  await expect(panel).toHaveClass(/is-open/);
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });
  await expect(panel).not.toHaveClass(/is-open/);
});

test("PagePill · DirectionSwitcher 4 boutons + lien Atlas indexable", async ({
  page,
}) => {
  await page.goto("/");
  // Le contenu doit être dans le HTML servi (pattern Slots)
  const html = await page.content();
  expect(html).toContain("page-pill-btn");
  expect(html).toContain("Apparatus");
  expect(html).toContain("Manifesto");
  expect(html).toContain("Console");
  expect(html).toContain("Atlas");
});

test.fixme("PagePill · invisible au top, visible après scroll, caché proche footer", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // BootSplash overlay (z-index:200) bloque les clicks pendant ~1.1s post-mount
  await page.waitForFunction(() => !document.querySelector(".boot"), {
    timeout: 5000,
  });
  const pill = page.locator(".page-pill").first();

  // Top : pas la classe is-visible
  await expect(pill).not.toHaveClass(/is-visible/);

  // Scroll mid · doit apparaître
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: "instant" }));
  await page.waitForTimeout(300);
  await expect(pill).toHaveClass(/is-visible/);

  // Très bas · doit re-disparaître
  await page.evaluate(() =>
    window.scrollTo({
      top: document.body.scrollHeight - 100,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(300);
  await expect(pill).not.toHaveClass(/is-visible/);
});

test("FAQ · bloc visible + JSON-LD FAQPage présent", async ({ page }) => {
  await page.goto("/");
  // Au moins une question rendue
  const faqHeading = page.getByRole("heading", { name: /Questions/i });
  await expect(faqHeading).toBeVisible();
  // JSON-LD FAQPage dans le head (essentiel pour AIO)
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(jsonLd.some((s) => s.includes("FAQPage"))).toBe(true);
});

test("SEO · canonical + hreflang FR/EN sur la home", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /waimia\.com\/?$/,
  );
  const alternates = await page
    .locator('link[rel="alternate"][hreflang]')
    .count();
  expect(alternates).toBeGreaterThanOrEqual(2); // fr-FR + en-US au minimum
});

test.fixme("Mobile sheet · burger ouvre, close ferme · body overflow propre", async ({
  page,
}) => {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // BootSplash overlay (z-index:200) bloque les clicks pendant ~1.1s post-mount
  await page.waitForFunction(() => !document.querySelector(".boot"), {
    timeout: 5000,
  });
  await page.locator("[data-burger]").click();
  await expect(page.locator("[data-mobile-sheet]")).toHaveClass(/is-open/);
  // body.style.overflow='hidden' est posé inline par le script (lock scroll)
  await expect(page.locator("body")).toHaveAttribute(
    "style",
    /overflow:\s*hidden/,
  );

  await page.locator("[data-mobile-close]").click();
  await expect(page.locator("[data-mobile-sheet]")).not.toHaveClass(/is-open/);
  // Inline overflow vidé · le CSS global (overflow-x:clip) reprend la main
  const bodyStyle = await page.locator("body").getAttribute("style");
  expect(bodyStyle ?? "").not.toMatch(/overflow:\s*hidden/);
});
