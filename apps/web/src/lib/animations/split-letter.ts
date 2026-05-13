let splitTextPromise: Promise<typeof import('gsap/SplitText').SplitText> | null = null;

async function loadSplitText(): Promise<typeof import('gsap/SplitText').SplitText> {
  if (!splitTextPromise) {
    splitTextPromise = Promise.all([
      import('./gsap-init'),
      import('gsap/SplitText'),
    ]).then(([{ gsap }, { SplitText }]) => {
      gsap.registerPlugin(SplitText);
      return SplitText;
    });
  }
  return splitTextPromise;
}

async function splitVisibleLetters(): Promise<void> {
  if (typeof document === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [...document.querySelectorAll<HTMLElement>('.reveal-split-letter')]
    .filter((el) => el.dataset.splitLetterReady !== 'true');

  if (targets.length === 0) return;

  const SplitText = await loadSplitText();

  targets.forEach((el) => {
    el.dataset.splitLetterReady = 'true';
    const split = new SplitText(el, {
      type: 'chars',
      charsClass: 's-char',
    });

    split.chars.forEach((char, index) => {
      if (char instanceof HTMLElement) {
        char.style.transitionDelay = `${Math.min(index * 28, 720)}ms`;
      }
    });
  });
}

export function initSplitLetterReveal(): void {
  void splitVisibleLetters();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplitLetterReveal);
  } else {
    initSplitLetterReveal();
  }
  document.addEventListener('astro:page-load', initSplitLetterReveal);
}
