/**
 * Email Layout · base partagée pour tous les templates Waimia
 * Wraps all transactional/automation emails with consistent header/footer.
 */
// Imports minimaux de @react-email/components (retire Tailwind, Heading, Img
// qui n'étaient pas utilisés et dont le bundle Tailwind component plantait
// silencieusement le bundle SSR Astro/Vite — cause root du 404 API en prod).
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface LayoutProps {
  preview: string;
  children: React.ReactNode;
  /** URL canonique pour bouton "Voir dans le navigateur" */
  webUrl?: string;
}

const ACCENT = "#C94F2E";
const PAPER = "#F6F1E8";
const INK = "#0C0B09";
const MUTED = "#7A6F60";

export function EmailLayout({ preview, children, webUrl }: LayoutProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: PAPER,
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: INK,
          margin: 0,
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            backgroundColor: PAPER,
          }}
        >
          {/* Header · wordmark Waimia */}
          <Section style={{ paddingBottom: 28, textAlign: "left" as const }}>
            <Text
              style={{
                fontFamily:
                  '"Instrument Serif", Georgia, "Times New Roman", serif',
                fontSize: 28,
                letterSpacing: "-0.02em",
                color: INK,
                margin: 0,
                fontWeight: 400,
              }}
            >
              Waim
              <span style={{ color: ACCENT, fontStyle: "italic" }}>i</span>a
              <span style={{ color: ACCENT }}>.</span>
            </Text>
          </Section>

          <Hr style={{ borderColor: "#E0DBD2", margin: 0 }} />

          {/* Body · slot */}
          <Section style={{ padding: "36px 0" }}>{children}</Section>

          <Hr style={{ borderColor: "#E0DBD2", margin: 0 }} />

          {/* Footer */}
          <Section style={{ paddingTop: 20, textAlign: "center" as const }}>
            <Text
              style={{
                fontSize: 11,
                color: MUTED,
                letterSpacing: "0.06em",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Waimia · Paris · Genève ·{" "}
              <Link
                href="https://waimia.com"
                style={{ color: MUTED, textDecoration: "underline" }}
              >
                waimia.com
              </Link>
            </Text>
            {webUrl && (
              <Text
                style={{
                  fontSize: 11,
                  color: MUTED,
                  margin: "12px 0 0",
                }}
              >
                <Link
                  href={webUrl}
                  style={{ color: ACCENT, textDecoration: "underline" }}
                >
                  Voir dans le navigateur
                </Link>
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ───── Helpers de styles partagés ───── */
export const h1Style = {
  fontFamily: '"Instrument Serif", Georgia, "Times New Roman", serif',
  fontSize: 36,
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  fontWeight: 400,
  color: INK,
  margin: "0 0 16px",
};

export const pStyle = {
  fontSize: 15,
  lineHeight: 1.55,
  color: INK,
  margin: "0 0 14px",
};

export const mutedStyle = {
  fontSize: 13,
  lineHeight: 1.55,
  color: MUTED,
  margin: "0 0 12px",
};

export const buttonLinkStyle = {
  display: "inline-block",
  backgroundColor: INK,
  color: PAPER,
  padding: "14px 24px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 500,
  textDecoration: "none",
  letterSpacing: "-0.005em",
};

export const accentLinkStyle = {
  color: ACCENT,
  textDecoration: "underline",
};

export { ACCENT, PAPER, INK, MUTED };
