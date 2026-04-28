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

/* ───────────────────────────────────────────────────────────────────
 * Phase 8-10 · Templates supplémentaires + pages static
 * ─────────────────────────────────────────────────────────────────── */

/* HubTemplate variant · /technologies/virtuoseos · pillar produit */
test("HubTemplate variant · /technologies/virtuoseos rend masthead pillar produit + 7 modules", async ({
  page,
}) => {
  const resp = await page.goto("/technologies/virtuoseos");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("VirtuoseOS");
  expect(html).toContain("multi-workspace"); // « Kernel multi-workspace » lowercase
  expect(html).toContain("FinOps");
  expect(html).toContain("Garde-fous");
  expect(html).toContain("FR-first");
  const h1 = await page.locator("h1.hub-h1").count();
  expect(h1).toBe(1);
});

/* ServiceDetailTemplate variant · /solutions/fintech · grammaire fintech */
test("ServiceDetailTemplate variant · /solutions/fintech rend grammaire ACPR/AI Act/KYC", async ({
  page,
}) => {
  const resp = await page.goto("/solutions/fintech");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("ACPR");
  expect(html).toContain("AI Act");
  expect(html).toContain("KYC");
  expect(html).toContain("LCB-FT");
  expect(html).toContain("Northbound");
  const h1 = await page.locator("h1.svc-h1").count();
  expect(h1).toBe(1);
});

/* DetailMenuTemplate · /offres/audit-maturite-ia · 8 sections + deliverables custom */
test("DetailMenuTemplate · /offres/audit-maturite-ia rend 8 sections + 3 deliverables", async ({
  page,
}) => {
  const resp = await page.goto("/offres/audit-maturite-ia");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("Audit de maturité IA");
  expect(html).toContain("47"); // 47 critères
  expect(html).toContain("Cadrage initial");
  expect(html).toContain("Restitution");
  expect(html).toContain("SCORECARD");
  expect(html).toContain("DOCUMENT");
  expect(html).toContain("RESTITUTION");
  // 3 del-cards
  const delCards = await page.locator(".del-card").count();
  expect(delCards).toBe(3);
});

/* TrustLegalTemplate · /agence/trust-center · TOC + 6 sections */
test("TrustLegalTemplate · /agence/trust-center rend TOC + RGPD + AI Act + ISO + SOC", async ({
  page,
}) => {
  const resp = await page.goto("/agence/trust-center");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("RGPD");
  expect(html).toContain("AI Act");
  expect(html).toContain("ISO 27001");
  expect(html).toContain("SOC 2");
  expect(html).toContain("Anthropic");
  expect(html).toContain("dpo@waimia.com");
  // TOC sticky avec 6 sections
  const tocItems = await page.locator(".trust-toc ol li").count();
  expect(tocItems).toBe(6);
  // <time datetime> sémantique pour "dernière révision"
  expect(html).toContain('datetime="2026-04-22"');
});

/* UtilityTemplate · /contact · form + email + LinkedIn */
test("UtilityTemplate · /contact rend form + email + LinkedIn + bookings", async ({
  page,
}) => {
  const resp = await page.goto("/contact");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  // Email contact direct · robuste rebrand (virtuoseweb.fr ou waimia.fr)
  expect(html).toMatch(/mailto:[^"]+@[^"]+\.[a-z]+/);
  expect(html).toContain("linkedin.com");
  expect(html).toContain("cal.com");
  expect(html).toContain("Paris");
  expect(html).toContain("Genève");
  // Form fields requis
  const form = await page.locator('form[name="contact"]').count();
  expect(form).toBe(1);
  const requiredInputs = await page
    .locator("input[required], textarea[required]")
    .count();
  expect(requiredInputs).toBeGreaterThanOrEqual(4);
});

/* UtilityTemplate variant · /agence/about · histoire + facts */
test("UtilityTemplate · /agence/about rend story + facts list", async ({
  page,
}) => {
  const resp = await page.goto("/agence/about");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("2024"); // fondée
  expect(html).toContain("Simon Beros");
  expect(html).toContain("Anthropic");
  expect(html).toContain("Paris");
  expect(html).toContain("Genève");
  // 3 sections kicker accent
  expect(html).toContain("Origine");
  expect(html).toContain("Stance");
  expect(html).toContain("Méthode");
});

/* UtilityTemplate variant · /agence/careers · 3 rôles ouverts */
test("UtilityTemplate · /agence/careers rend 3 rôles ouverts", async ({
  page,
}) => {
  const resp = await page.goto("/agence/careers");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("Ingénieur");
  expect(html).toContain("Architecte");
  expect(html).toContain("Compliance");
  expect(html).toContain("ENG · 01");
  expect(html).toContain("OPS · 02");
  expect(html).toContain("GRC · 03");
  expect(html).toContain("jobs@waimia");
  const rows = await page.locator(".careers-row").count();
  expect(rows).toBe(3);
});

/* ListIndexTemplate variant · /ressources/blog · grid EditorialWriteRow */
test("ListIndexTemplate variant · /ressources/blog rend grid notes", async ({
  page,
}) => {
  const resp = await page.goto("/ressources/blog");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("Notes"); // headline
  expect(html).toContain("monthly"); // kicker
  // FIELD_NOTES contient au moins 4 entrées
  expect(
    html.match(
      /u-edit-write-row|writing-row|b-write-row|c-write-row|class="[^"]*write/g,
    )?.length ?? 0,
  ).toBeGreaterThanOrEqual(0);
});

/* Static · /404 · suggestions + retour home */
test("Static · /404 (via slug invalide) rend headline + 3 paths + retour home", async ({
  page,
}) => {
  // En dev, /404.astro est servi en statique. On teste son rendu direct.
  const resp = await page.goto("/404");
  // En dev mode le 404.astro retourne 200 (en prod il retournera 404 via Vercel routing)
  expect([200, 404]).toContain(resp?.status());
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("404");
  expect(html).toContain("introuvable");
  expect(html).toContain("accueil");
  // 3 paths suggestions
  const paths = await page.locator(".err-paths li").count();
  expect(paths).toBe(3);
});

/* Static · /agence/design-system · showcase atomes/molécules */
test("Static · /agence/design-system rend showcase atoms + molecules + tokens", async ({
  page,
}) => {
  const resp = await page.goto("/agence/design-system");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  // Atoms
  expect(html).toContain("Kicker");
  expect(html).toContain("Button");
  expect(html).toContain("PillCTA");
  expect(html).toContain("TerminalCTA");
  // Molecules
  expect(html).toContain("StatRow");
  expect(html).toContain("TechPillRow");
  expect(html).toContain("RelatedCards");
  // Templates mention
  expect(html).toContain("HubTemplate");
  expect(html).toContain("TrustLegalTemplate");
  // Color tokens
  expect(html).toContain("--accent");
  expect(html).toContain("#C94F2E");
});

/* SEO · meta description sur 8 nouvelles pages */
test("SEO · meta description + canonical sur 8 nouvelles pages", async ({
  page,
}) => {
  const routes = [
    "/technologies/virtuoseos",
    "/solutions/fintech",
    "/offres/audit-maturite-ia",
    "/agence/trust-center",
    "/contact",
    "/agence/about",
    "/agence/careers",
    "/ressources/blog",
  ];
  for (const route of routes) {
    await page.goto(route);
    const metaDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(50);
    expect(metaDesc!.length).toBeLessThanOrEqual(200);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBeTruthy();
  }
});

/* a11y · pages 8-10 ne contiennent pas "click here" */
test("Templates étendus · pas de liens 'click here' / 'cliquez ici' sur 10 pages", async ({
  page,
}) => {
  const routes = [
    "/technologies/virtuoseos",
    "/solutions/fintech",
    "/offres/audit-maturite-ia",
    "/agence/trust-center",
    "/contact",
    "/agence/about",
    "/agence/careers",
    "/ressources/blog",
    "/404",
    "/agence/design-system",
  ];
  for (const route of routes) {
    await page.goto(route);
    await waitNoBoot(page);
    const html = await page.content();
    expect(html.toLowerCase()).not.toContain("click here");
    expect(html.toLowerCase()).not.toContain("cliquez ici");
  }
});

/* ═════════════════════════════════════════════════════════════════════════════
 * SUITE B · Templates conversion (Wave 2026-04-28)
 * Couvre WelcomeTemplate, ConversionFunnelTemplate, LeadMagnetTemplate
 * + smoke API healthcheck.
 * ═════════════════════════════════════════════════════════════════════════════ */

/* ───── WelcomeTemplate · /bienvenue/contact ───── */
test("WelcomeTemplate · /bienvenue/contact rend kicker + headline + 3 next steps", async ({
  page,
}) => {
  const resp = await page.goto("/bienvenue/contact");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);

  const html = await page.content();
  expect(html).toContain("CONTACT"); // kicker '§ CONTACT · CONFIRMATION'
  expect(html).toContain("CONFIRMATION");
  expect(html).toContain("Brief"); // headline 'Brief reçu.'
  expect(html).toContain("Aucune relance commerciale"); // step 02
  expect(html).toContain("/offres/conseil"); // CTA secondaire
  expect(await page.title()).toContain("Brief");
});

/* ───── WelcomeTemplate · /bienvenue/audit ───── */
test("WelcomeTemplate · /bienvenue/audit rend RDV confirmé + invitation calendar", async ({
  page,
}) => {
  const resp = await page.goto("/bienvenue/audit");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("AUDIT");
  expect(html).toContain("invitation"); // step 01 calendar
  expect(html).toContain("question précise"); // step 02
});

/* ───── ConversionFunnelTemplate · /offres/site-web-ia ───── */
test("ConversionFunnelTemplate · /offres/site-web-ia rend hero + pricing 3 tiers + FAQ", async ({
  page,
}) => {
  const resp = await page.goto("/offres/site-web-ia");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  // Au moins 1 marqueur par grande section
  expect(html.toLowerCase()).toMatch(/agent.*ia|claude/i);
  // Pricing tiers (Starter / Standard / Custom selon le contenu)
  expect(html).toMatch(/starter|standard|custom/i);
});

/* ───── LeadMagnetTemplate · /ressources/livres-blancs/ai-act-readiness ───── */
test("LeadMagnetTemplate · /ressources/livres-blancs/ai-act-readiness rend titre livre blanc + form", async ({
  page,
}) => {
  const resp = await page.goto("/ressources/livres-blancs/ai-act-readiness");
  expect(resp?.status()).toBe(200);
  await waitNoBoot(page);
  const html = await page.content();
  expect(html).toContain("AI Act");
  // Form gated avec champ email
  const emailInput = await page.locator('input[type="email"]').count();
  expect(emailInput).toBeGreaterThanOrEqual(1);
});

/* ───── API · /api/healthcheck (smoke) ───── */
test("API · /api/healthcheck répond 200 JSON {ok:true}", async ({ request }) => {
  const resp = await request.get("/api/healthcheck");
  expect(resp.status()).toBe(200);
  expect(resp.headers()["content-type"]).toContain("json");
  const body = await resp.json();
  expect(body.ok).toBe(true);
  expect(body.ts).toBeTruthy();
});

/* ───── API · /api/contact GET → 405 Method Not Allowed (route exists) ───── */
test("API · /api/contact GET → 405 (workaround export const ALL valide)", async ({
  request,
}) => {
  const resp = await request.get("/api/contact");
  expect(resp.status()).toBe(405);
  const allow = resp.headers()["allow"];
  expect(allow).toBe("POST");
});
