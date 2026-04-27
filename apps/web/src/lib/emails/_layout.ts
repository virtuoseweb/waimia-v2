/**
 * Email Layout · base partagée pour tous les templates Waimia (HTML inline).
 *
 * Pourquoi pas React Email ?
 * Les imports `@react-email/components` et `@react-email/render` cassent
 * silencieusement le bundle SSR Astro/Vite/Vercel monorepo (validé empirique
 * 2026-04-27 : routes /api/*.ts disparaissaient du bundle entry.mjs → 404
 * en prod). Solution : HTML inline en template strings · zéro dépendance
 * React dans le graphe d'import des routes API.
 */

export const ACCENT = "#C94F2E";
export const PAPER = "#F6F1E8";
export const INK = "#0C0B09";
export const MUTED = "#7A6F60";
export const RULE = "#E0DBD2";
export const SOFT = "#EFEAE0";

const FONT_BODY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_SERIF =
  "'Instrument Serif', Georgia, 'Times New Roman', serif";

/** Échappe les valeurs interpolées dans le HTML pour éviter toute injection. */
export function escapeHtml(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Échappe une URL pour usage dans href= (autorise http(s)/mailto/tel uniquement). */
export function escapeUrl(value: unknown): string {
  const v = String(value ?? "");
  if (!/^(https?:|mailto:|tel:|\/)/i.test(v)) return "#";
  return v.replace(/"/g, "&quot;");
}

/* ───── Styles partagés (inline dans les templates) ───── */
export const h1Style =
  `font-family:${FONT_SERIF};font-size:36px;line-height:1.05;` +
  `letter-spacing:-0.02em;font-weight:400;color:${INK};margin:0 0 16px;`;

export const pStyle = `font-size:15px;line-height:1.55;color:${INK};margin:0 0 14px;`;

export const mutedStyle = `font-size:13px;line-height:1.55;color:${MUTED};margin:0 0 12px;`;

export const buttonLinkStyle =
  `display:inline-block;background-color:${INK};color:${PAPER};` +
  `padding:14px 24px;border-radius:999px;font-size:14px;font-weight:500;` +
  `text-decoration:none;letter-spacing:-0.005em;`;

export const accentLinkStyle = `color:${ACCENT};text-decoration:underline;`;

export const cardSoftStyle =
  `background:${SOFT};padding:18px 22px;border-radius:8px;margin:20px 0;`;

export const eyebrowStyle =
  `font-size:11px;letter-spacing:0.1em;text-transform:uppercase;` +
  `color:${MUTED};margin:0 0 8px;`;

/**
 * Wrap un contenu HTML body dans le layout complet (header + footer).
 * @param content   HTML inner (déjà rendu) du body de l'email
 * @param preview   Texte preview affiché dans la liste mail
 * @param webUrl    Optionnel · lien "Voir dans le navigateur"
 */
export function wrapEmail(
  content: string,
  preview: string,
  webUrl?: string,
): string {
  const previewSafe = escapeHtml(preview);
  const webLink = webUrl
    ? `<tr><td align="center" style="padding:12px 0 0;font-size:11px;color:${MUTED};">` +
      `<a href="${escapeUrl(webUrl)}" style="${accentLinkStyle}">Voir dans le navigateur</a>` +
      `</td></tr>`
    : "";

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>Waimia</title>
    <style>
      body { margin:0; padding:0; background:${PAPER}; }
      a { text-decoration: none; }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${PAPER};color:${INK};font-family:${FONT_BODY};">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewSafe}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER};padding:40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:${PAPER};">
            <tr>
              <td style="padding:0 0 28px;text-align:left;">
                <span style="font-family:${FONT_SERIF};font-size:28px;letter-spacing:-0.02em;color:${INK};font-weight:400;">Waim<span style="color:${ACCENT};font-style:italic;">i</span>a<span style="color:${ACCENT};">.</span></span>
              </td>
            </tr>
            <tr><td style="border-top:1px solid ${RULE};line-height:0;font-size:0;">&nbsp;</td></tr>
            <tr>
              <td style="padding:36px 0;">
                ${content}
              </td>
            </tr>
            <tr><td style="border-top:1px solid ${RULE};line-height:0;font-size:0;">&nbsp;</td></tr>
            <tr>
              <td align="center" style="padding:20px 0 0;">
                <p style="margin:0;font-size:11px;color:${MUTED};letter-spacing:0.06em;text-transform:uppercase;">Waimia · Paris · Genève · <a href="https://waimia.com" style="color:${MUTED};text-decoration:underline;">waimia.com</a></p>
              </td>
            </tr>
            ${webLink}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
