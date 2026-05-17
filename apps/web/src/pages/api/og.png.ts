import type { APIRoute } from "astro";
import { Resvg } from "@resvg/resvg-js";

export const prerender = false;

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);
}

function splitTitle(title: string): [string, string] {
  const midpoint = Math.ceil(title.length / 2);
  const before = title.lastIndexOf(" ", midpoint);
  const after = title.indexOf(" ", midpoint);

  let splitAt = -1;

  if (before === -1) {
    splitAt = after;
  } else if (after === -1) {
    splitAt = before;
  } else {
    splitAt = midpoint - before <= after - midpoint ? before : after;
  }

  if (splitAt === -1) {
    splitAt = midpoint;
  }

  const firstLine = title.slice(0, splitAt).trim();
  const secondLine = title.slice(splitAt).trim();

  return [firstLine, secondLine];
}

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get("title") ?? "Waimia";
  const kicker = url.searchParams.get("kicker") ?? "Intelligence artificielle";
  const author = url.searchParams.get("author") ?? "";

  const safeKicker = escapeXml(kicker);
  const safeAuthor = escapeXml(author);

  const titleMarkup =
    title.length > 40
      ? (() => {
          const [firstLine, secondLine] = splitTitle(title);

          return `
    <text fill="#1a1a1a" x="80" y="200" font-size="60" font-family="Georgia, serif" font-weight="bold">${escapeXml(firstLine)}</text>
    <text fill="#1a1a1a" x="80" y="290" font-size="60" font-family="Georgia, serif" font-weight="bold">${escapeXml(secondLine)}</text>`;
        })()
      : `
    <text fill="#1a1a1a" x="80" y="260" font-size="72" font-family="Georgia, serif" font-weight="bold">${escapeXml(title)}</text>`;

  const authorMarkup = safeAuthor
    ? `
    <text fill="#666666" x="80" y="590" font-size="20" font-family="Georgia, serif">${safeAuthor}</text>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <rect width="1200" height="630" fill="#F6F1E8"/>
  <text fill="#8B7355" x="80" y="100" font-size="24" font-family="Georgia, serif" font-style="italic">${safeKicker}</text>${titleMarkup}
  <line x1="80" y1="560" x2="400" y2="560" stroke="#8B7355" stroke-width="2"/>${authorMarkup}
  <text fill="#8B7355" x="1120" y="590" font-size="20" font-family="Georgia, serif" text-anchor="end">Waimia</text>
</svg>`;

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngBuffer = new Uint8Array(resvg.render().asPng());

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
