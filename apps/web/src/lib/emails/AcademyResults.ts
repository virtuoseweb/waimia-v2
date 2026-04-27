// Email · AcademyResults · POST /api/academy
// Scorecard diagnostic 12 questions + 3 prochaines actions priorisées.
import {
  wrapEmail,
  escapeHtml,
  h1Style,
  pStyle,
  mutedStyle,
  buttonLinkStyle,
  ACCENT,
  MUTED,
} from "./_layout";

interface NextAction {
  title: string;
  effort: string;
  impact: string;
}

interface Props {
  firstName?: string;
  /** Score total /24 */
  score: number;
  /** Catégorie déterminée (selon score) */
  category: "discovery" | "building" | "mature";
  /** 3 actions priorisées par coût-de-correction */
  nextActions: NextAction[];
}

const categoryLabel: Record<Props["category"], { fr: string; tag: string }> = {
  discovery: { fr: "Découverte", tag: "0-8/24" },
  building: { fr: "En construction", tag: "9-16/24" },
  mature: { fr: "Mature", tag: "17-24/24" },
};

export default function AcademyResults({
  firstName = "bonjour",
  score,
  category,
  nextActions,
}: Props): string {
  const fn = escapeHtml(firstName);
  const cat = categoryLabel[category];
  const catFr = escapeHtml(cat.fr);
  const catTag = escapeHtml(cat.tag);
  const scoreSafe = escapeHtml(score);

  const actions = nextActions
    .map((action, i) => {
      const title = escapeHtml(action.title);
      const effort = escapeHtml(action.effort);
      const impact = escapeHtml(action.impact);
      return (
        `<div style="border:1px solid #E0DBD2;border-radius:8px;padding:16px;margin:12px 0;">` +
        `<p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${ACCENT};margin:0 0 6px;">Action ${i + 1}</p>` +
        `<p style="${pStyle}margin:0 0 6px;font-weight:500;">${title}</p>` +
        `<p style="${mutedStyle}">Effort : ${effort} · Impact : ${impact}</p>` +
        `</div>`
      );
    })
    .join("");

  const content =
    `<h1 style="${h1Style}">Votre scorecard, ${fn}.</h1>` +
    `<div style="background:#EFEAE0;padding:24px;border-radius:12px;margin:20px 0;text-align:center;">` +
    `<p style="font-size:56px;line-height:1;color:${ACCENT};margin:0;font-family:'Instrument Serif',Georgia,'Times New Roman',serif;">${scoreSafe}<span style="font-size:28px;color:${MUTED};">/24</span></p>` +
    `<p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${MUTED};margin:8px 0 0;">${catFr} · ${catTag}</p>` +
    `</div>` +
    `<p style="${pStyle}">Voici les <strong>3 prochaines actions</strong> priorisées par coût-de-correction (l'inverse de la difficulté × l'impact attendu).</p>` +
    actions +
    `<div style="text-align:center;padding:20px 0;">` +
    `<a href="https://waimia.com/contact" style="${buttonLinkStyle}">En parler 45 min →</a>` +
    `</div>` +
    `<p style="${mutedStyle}">Aucun rappel commercial automatique. Le diagnostic reste utile sans nous.</p>`;

  return wrapEmail(content, `Scorecard · ${score}/24 · ${cat.fr}`);
}
