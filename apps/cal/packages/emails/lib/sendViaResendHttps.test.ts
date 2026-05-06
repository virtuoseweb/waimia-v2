import { describe, expect, it } from "vitest";

import { normalizeFromAddress } from "./sendViaResendHttps";

describe("normalizeFromAddress", () => {
  it("returns input unchanged when already in valid 'Name <email>' format", () => {
    expect(normalizeFromAddress("Waimia <waimia@virtuoseweb.fr>")).toBe(
      "Waimia <waimia@virtuoseweb.fr>"
    );
  });

  it("returns input unchanged when bare email", () => {
    expect(normalizeFromAddress("waimia@virtuoseweb.fr")).toBe("waimia@virtuoseweb.fr");
  });

  it("unwraps double-wrapped 'Outer <Inner <email>>' to 'Outer <email>'", () => {
    expect(normalizeFromAddress("Waimia <Waimia <waimia@virtuoseweb.fr>>")).toBe(
      "Waimia <waimia@virtuoseweb.fr>"
    );
  });

  it("preserves outer name when inner has different name (real cal.diy pattern)", () => {
    expect(normalizeFromAddress("simon beros <Waimia <waimia@virtuoseweb.fr>>")).toBe(
      "simon beros <waimia@virtuoseweb.fr>"
    );
  });

  it("handles whitespace variations in double-wrap", () => {
    expect(normalizeFromAddress("  Outer  <  Inner  <  email@domain.com  >  >  ")).toBe(
      "Outer <email@domain.com>"
    );
  });

  it("handles multi-word names with accents", () => {
    expect(normalizeFromAddress("Équipe Waimia <Waimia <hello@waimia.com>>")).toBe(
      "Équipe Waimia <hello@waimia.com>"
    );
  });
});
