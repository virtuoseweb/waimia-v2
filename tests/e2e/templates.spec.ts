/* Templates handoff2 · vérifie que les 5 templates rendent leurs marqueurs essentiels
 * Cible : éviter les régressions silencieuses sur HubTemplate, ServiceDetailTemplate,
 * CaseStudyTemplate, EssayTemplate, ListIndexTemplate.
 *
 * Chaque test :
 *   - HTTP 200
 *   - Contenu critique présent dans HTML servi (indexable par crawlers LLM)
 *   - Hiérarchie h1/h2 cohérente
 *   - Liens descriptifs (pas de "click here") */
import { test, expect } from "@playwright/test";

/* ───── Helper · attendre fin du BootSplash overlay ───── */
async function waitNoBoot(page: import("@playwright/test").Page) {
  await page.waitForFunction(() => !document.querySelector(".boot"), {
    timeout: 5000,
  });
}

/* ───── Template HubTemplate · /offres/conseil ───── */
test("HubTemplate · /offres/conseil rend masthead + catalogue + fit + related", async ({
  page,
}) => {
  const resp = await page.goto("/offres/conseil");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);

  const html = await page.content();
  // Masthead · 4 stats du hub
  expect(html).toContain("interventions"); // stat 1
  expect(html).toContain("pipeline audité"); // stat 2
  // Service catalog · 7 services présents
  expect(html).toContain("Audit de maturité IA"); // service 02.1
  expect(html).toContain("AI FinOps"); // service 02.6
  // Fit columns · pour la DSI / refusera si
  expect(html).toContain("DSI");
  expect(html).toContain("logo for your innovation report");
  // Related · 3 cas
  expect(html).toContain("Plateau SaaS");

  // h1 unique
  // h1 unique dans le contenu (exclut les h1 d'Astro dev toolbar)
  const contentH1 = await page
    .locator(
      "h1.hub-h1, h1.svc-h1, h1.case-h1, h1.essay-h1, h1.list-h1, h1.hero-headline",
    )
    .count();
  expect(contentH1).toBe(1);
});

/* ───── Template ServiceDetailTemplate · /offres/revops ───── */
test("ServiceDetailTemplate · /offres/revops rend problem + steps + proof + stack", async ({
  page,
}) => {
  const resp = await page.goto("/offres/revops");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);

  const html = await page.content();
  // Problem stats
  expect(html).toContain("RevOps");
  expect(html).toContain("43"); // 43 outils
  // Approach steps · 4 phases
  expect(html).toContain("Audit du funnel");
  expect(html).toContain("Source de vérité unique");
  expect(html).toContain("Agents de triage");
  // Proof
  expect(html).toContain("Marie Cousin");
  expect(html).toContain("+€2.4M");
  // Tech pills
  expect(html).toContain("Claude Opus 4.7");
  expect(html).toContain("dbt");

  // h1 unique dans le contenu (exclut les h1 d'Astro dev toolbar)
  const contentH1 = await page
    .locator(
      "h1.hub-h1, h1.svc-h1, h1.case-h1, h1.essay-h1, h1.list-h1, h1.hero-headline",
    )
    .count();
  expect(contentH1).toBe(1);
});

/* ───── Template CaseStudyTemplate · /ressources/cas/plateau ───── */
test("CaseStudyTemplate · /ressources/cas/plateau rend masthead + specs + steps + proof", async ({
  page,
}) => {
  const resp = await page.goto("/ressources/cas/plateau");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);

  const html = await page.content();
  // Spec bar · 5 items
  expect(html).toContain("Plateau");
  expect(html).toContain("SaaS B2B"); // sector
  expect(html).toContain("10 sem"); // duration
  expect(html).toContain("HubSpot"); // stack
  // Context · 47 contradictions
  expect(html).toContain("47");
  expect(html).toContain("contradictions");
  // Approach steps
  expect(html).toContain("Lecture du funnel");
  // Proof
  expect(html).toContain("Marie Cousin");
  // Stack pills
  expect(html).toContain("VirtuoseOS");

  // h1 unique dans le contenu (exclut les h1 d'Astro dev toolbar)
  const contentH1 = await page
    .locator(
      "h1.hub-h1, h1.svc-h1, h1.case-h1, h1.essay-h1, h1.list-h1, h1.hero-headline",
    )
    .count();
  expect(contentH1).toBe(1);
});

/* ───── Template EssayTemplate · /ressources/blog/brain-circuit ───── */
test("EssayTemplate · /ressources/blog/brain-circuit rend kicker + lede + body + meta", async ({
  page,
}) => {
  const resp = await page.goto("/ressources/blog/brain-circuit");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);

  const html = await page.content();
  // Kicker
  expect(html).toContain("ESSAY · 03");
  // Headline · cerveau-circuit en italic
  expect(html).toContain("cerveau-circuit");
  // Lede
  expect(html).toContain("L'imagerie cerveau-circuit a tué");
  // Body · sections h2
  expect(html).toContain("Le théâtre arrive avant le diagnostic");
  expect(html).toContain("Trois symptômes");
  expect(html).toContain("L'antidote");
  // Meta auteur + date
  expect(html).toContain("Simon Beros");
  expect(html).toContain("2026-04-22");
  expect(html).toContain("9 min");
  // <time datetime> sémantique
  expect(html).toContain('datetime="2026-04-22"');

  // <article> wrapping
  const articleCount = await page.locator("article.essay").count();
  expect(articleCount).toBe(1);

  // Hiérarchie h1 unique + h2 multiples (dans .essay-prose pour exclure overlays dev)
  const contentH1 = await page.locator("h1.essay-h1").count();
  expect(contentH1).toBe(1);
  const proseH2 = await page.locator(".essay-prose h2").count();
  expect(proseH2).toBeGreaterThanOrEqual(3); // au moins 3 sections
});

/* ───── Template ListIndexTemplate · /ressources/cas (index) ───── */
test("ListIndexTemplate · /ressources/cas rend grid case cards (5 items CASE_FEED)", async ({
  page,
}) => {
  const resp = await page.goto("/ressources/cas");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);

  const html = await page.content();
  // Headline + lede
  expect(html).toContain("dossiers");
  expect(html).toContain("démo");
  // Les 5 cases du CASE_FEED
  expect(html).toContain("Plateau");
  expect(html).toContain("Halcyon Health");
  expect(html).toContain("Northbound");
  expect(html).toContain("Caserne");
  expect(html).toContain("VirtuoseOS");

  // h1 unique dans le contenu (exclut les h1 d'Astro dev toolbar)
  const contentH1 = await page
    .locator(
      "h1.hub-h1, h1.svc-h1, h1.case-h1, h1.essay-h1, h1.list-h1, h1.hero-headline",
    )
    .count();
  expect(contentH1).toBe(1);
});

/* ───── Interactivité · hover sur ServiceCatalogRow ───── */
test("HubTemplate · hover ServiceCatalogRow déclenche transition", async ({
  page,
}) => {
  await page.goto("/offres/conseil");
  await waitNoBoot(page);

  const firstRow = page.locator("a.svc-row").first();
  await expect(firstRow).toBeVisible();

  // Hover déclenche padding-left + arrow translate
  const beforeBg = await firstRow.evaluate(
    (el) => window.getComputedStyle(el).backgroundColor,
  );
  await firstRow.hover();
  await page.waitForTimeout(280); // attendre transition 240ms
  const afterBg = await firstRow.evaluate(
    (el) => window.getComputedStyle(el).backgroundColor,
  );

  // Le background doit changer (paper-2 vs default)
  expect(beforeBg).not.toBe(afterBg);
});

/* ───── Interactivité · hover sur tech-pill ───── */
test("ServiceDetailTemplate · hover tech-pill change border-color", async ({
  page,
}) => {
  await page.goto("/offres/revops");
  await waitNoBoot(page);

  const firstPill = page.locator(".tech-pill").first();
  await expect(firstPill).toBeVisible();

  await firstPill.hover();
  await page.waitForTimeout(220);

  const borderColor = await firstPill.evaluate(
    (el) => window.getComputedStyle(el).borderColor,
  );
  // Border doit être terracotta (rgb(201, 79, 46))
  expect(borderColor).toMatch(/rgb\(201[,\s]+79[,\s]+46/);
});

/* ───── Accessibilité · liens descriptifs ───── */
test("Templates · pas de liens 'click here' / 'cliquez ici'", async ({
  page,
}) => {
  const routes = [
    "/offres/conseil",
    "/offres/revops",
    "/ressources/cas/plateau",
    "/ressources/blog/brain-circuit",
    "/ressources/cas",
  ];

  for (const route of routes) {
    await page.goto(route);
    await waitNoBoot(page);
    const html = await page.content();
    expect(html.toLowerCase()).not.toContain("click here");
    expect(html.toLowerCase()).not.toContain("cliquez ici");
    // Note · "ici" tout seul est OK (souvent dans paragraphes)
  }
});

/* ───── Responsive · mobile 375 ───── */
test("Templates · responsive mobile 375px sans overflow horizontal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });

  const routes = ["/offres/conseil", "/ressources/cas/plateau"];
  for (const route of routes) {
    await page.goto(route);
    await waitNoBoot(page);
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    // Pas d'overflow horizontal (tolérance 1px pour scrollbar)
    expect(scrollWidth - clientWidth).toBeLessThanOrEqual(1);
  }
});

/* ───── SEO · meta description + canonical ───── */
test("Templates · meta description + canonical présents sur les 5 pages", async ({
  page,
}) => {
  const routes = [
    "/offres/conseil",
    "/offres/revops",
    "/ressources/cas/plateau",
    "/ressources/blog/brain-circuit",
    "/ressources/cas",
  ];

  for (const route of routes) {
    await page.goto(route);
    const metaDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(50);
    expect(metaDesc!.length).toBeLessThanOrEqual(180);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBeTruthy();
  }
});
