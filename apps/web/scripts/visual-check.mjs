#!/usr/bin/env node
/**
 * visual-check.mjs · Infrastructure de validation visuelle multi-viewport
 *
 * Usage commun :
 *   node scripts/visual-check.mjs \
 *     --url http://localhost:4321/ \
 *     --viewports 1440x900,768x1024,390x844 \
 *     --canary "dept-row" \
 *     --measure ".hero-headline,.dept-row,.capstrip-group" \
 *     --name hero-validation \
 *     --output /tmp/waimia-snaps \
 *     --restart-dev true
 *
 * Workflow agentique Waimia · multi-agents :
 *   1. Worker Sonnet code une section (Edit/Write)
 *   2. Worker Sonnet invoque ce script en self-check :
 *      → vérifie canary CSS rendue, mesure dimensions sections,
 *        produit JSON parsable + PNG sauvegardés
 *   3. Worker Opus (ou orchestrateur Opus) lit les PNG pour validation visuelle
 *   4. Si KO : nouveau brief Sonnet avec corrections précises
 *
 * Fail-safes intégrés (résolution problème "Playwright hang infini") :
 *   · Timeout total bornable (--timeout, default 30000ms)
 *   · Browser kill explicite si hang
 *   · Canary check pré-launch (curl HTML) → détecte HMR Astro cassé sans
 *     lancer browser (rapide, < 500ms)
 *   · --restart-dev true : kill astro dev + signal pour relancer
 *   · Exit codes différenciés (0 OK, 1 canary fail, 2 dev server cassé, 3 timeout)
 *
 * Permanent · partagé entre workers et orchestrateur · cf
 *   docs/visual-check-protocol.md (à créer plus tard pour contributeurs futurs)
 */

import { chromium } from '@playwright/test';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

const exec$ = promisify(exec);

// ─── CLI args parsing minimal (sans dépendance externe) ──────────────────
const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    const key = argv[i].slice(2);
    const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : 'true';
    args[key] = val;
    if (val !== 'true') i++;
  }
}

const URL = args.url || 'http://localhost:4321/';
const VIEWPORTS = (args.viewports || '1440x900,768x1024,390x844')
  .split(',')
  .map((v) => {
    const [w, h] = v.split('x').map(Number);
    return { width: w, height: h };
  });
const CANARY = args.canary || '';
const MEASURE = args.measure ? args.measure.split(',') : [];
const NAME = args.name || 'page';
const OUTPUT = resolve(args.output || '/tmp/waimia-snaps');
const TIMEOUT = parseInt(args.timeout || '30000', 10);
const RESTART_DEV = args['restart-dev'] === 'true';

await fs.mkdir(OUTPUT, { recursive: true });

// ─── Canary check pré-launch (curl HTML, < 500ms) ─────────────────────────
if (CANARY) {
  try {
    const { stdout } = await exec$(`curl -s --max-time 5 "${URL}"`);
    if (!stdout.includes(CANARY)) {
      console.error(JSON.stringify({
        error: 'CANARY_MISSING',
        canary: CANARY,
        url: URL,
        hint: 'HMR Astro probablement cassé. Restart dev server.',
      }, null, 2));
      if (RESTART_DEV) {
        console.error('→ Tentative kill astro dev...');
        await exec$('pkill -f "astro dev"').catch(() => {});
        await new Promise((r) => setTimeout(r, 2000));
        console.error('→ Astro dev killed. Relancer manuellement via `pnpm dev`.');
      }
      process.exit(2);
    }
  } catch (e) {
    console.error(JSON.stringify({ error: 'CANARY_CURL_FAIL', message: e.message }, null, 2));
    process.exit(1);
  }
}

// ─── Browser launch avec timeout strict ───────────────────────────────────
let browser;
try {
  browser = await Promise.race([
    chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('BROWSER_LAUNCH_TIMEOUT')), TIMEOUT)
    ),
  ]);
} catch (e) {
  console.error(JSON.stringify({ error: 'BROWSER_LAUNCH_FAIL', message: e.message }, null, 2));
  process.exit(3);
}

const results = [];

// ─── Boucle multi-viewport ────────────────────────────────────────────────
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const vpLabel = `${vp.width}x${vp.height}`;

  try {
    await Promise.race([
      page.goto(URL, { waitUntil: 'networkidle', timeout: TIMEOUT }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`GOTO_TIMEOUT_${vpLabel}`)), TIMEOUT)
      ),
    ]);
    await page.waitForTimeout(800);

    // Mesures DOM (positions, dimensions, computed styles)
    const measurements = {};
    for (const sel of MEASURE) {
      measurements[sel.trim()] = await page.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return { exists: false };
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          exists: true,
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
          display: cs.display,
          fontSize: cs.fontSize,
          fontFamily: cs.fontFamily.slice(0, 30),
          color: cs.color,
        };
      }, sel.trim());
    }

    // Indicateurs supplémentaires globaux
    const globals = await page.evaluate(() => {
      const cb = document.getElementById('cookies-banner');
      return {
        innerW: window.innerWidth,
        innerH: window.innerHeight,
        scrollW: document.documentElement.scrollWidth,
        scrollH: document.documentElement.scrollHeight,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        cookieVisible: cb && !cb.hasAttribute('hidden'),
        cookieHeight: cb ? cb.offsetHeight : 0,
      };
    });

    const screenshotPath = `${OUTPUT}/${NAME}-${vpLabel}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });

    results.push({
      viewport: vpLabel,
      screenshot: screenshotPath,
      globals,
      measurements,
    });
  } catch (e) {
    results.push({ viewport: vpLabel, error: e.message });
  } finally {
    await ctx.close();
  }
}

await browser.close();

// ─── Output JSON parsable par workers et orchestrateur ────────────────────
console.log(JSON.stringify({
  url: URL,
  canary: CANARY || null,
  capturedAt: new Date().toISOString(),
  results,
}, null, 2));

process.exit(0);
