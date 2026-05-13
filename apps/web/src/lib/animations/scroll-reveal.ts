/* Waimia · scroll-reveal.ts
   IntersectionObserver leger qui ajoute .is-visible aux elements .reveal[*].
   Idempotent — peut etre appele plusieurs fois sans dupliquer.
   Desactive si prefers-reduced-motion.
*/

const REVEAL_SELECTOR = [
  '.reveal',
  '.reveal-stagger',
  '.reveal-fade',
  '.reveal-slide',
  '.reveal-snap',
  '.reveal-mask-up',
  '.reveal-split-letter',
  '.reveal-curtain',
  '.reveal-zoom-in',
  '.reveal-blur-clip',
].join(', ');

let observer: IntersectionObserver | null = null;
const observed = new WeakSet<Element>();

function setupObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;

  return new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      }
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08,
    },
  );
}

export function initScrollReveal(): void {
  if (typeof document === 'undefined') return;
  if (!observer) observer = setupObserver();
  if (!observer) {
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      el.classList.add('is-visible', 'in');
    });
    resetParallax();
    return;
  }
  document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
    if (!observed.has(el)) {
      observer?.observe(el);
      observed.add(el);
    }
  });
  initScrollLinkedParallax();
}

let parallaxReady = false;
let parallaxRaf = 0;

function resetParallax(): void {
  document.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
    el.style.transform = '';
  });
}

function updateParallax(): void {
  parallaxRaf = 0;
  const viewportHeight = window.innerHeight || 1;
  document.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
    const speed = Number(el.dataset.par ?? '0');
    if (!Number.isFinite(speed) || speed === 0) return;
    const rect = el.getBoundingClientRect();
    const centerDelta = rect.top + rect.height / 2 - viewportHeight / 2;
    const offset = centerDelta * speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
}

function requestParallaxUpdate(): void {
  if (parallaxRaf) return;
  parallaxRaf = window.requestAnimationFrame(updateParallax);
}

function initScrollLinkedParallax(): void {
  if (parallaxReady) {
    requestParallaxUpdate();
    return;
  }
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    resetParallax();
    return;
  }
  if (!document.querySelector('[data-par]')) return;

  parallaxReady = true;
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate, { passive: true });
  requestParallaxUpdate();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
  document.addEventListener('astro:page-load', initScrollReveal);
}
