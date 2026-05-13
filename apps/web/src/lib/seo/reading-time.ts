export function computeReadingTime(text: string): number {
  const wpm = 220;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wpm));
}
