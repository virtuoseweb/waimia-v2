/* Waimia · scroll-reveal.ts
   IntersectionObserver leger qui ajoute .is-visible aux elements .reveal[*].
   Idempotent — peut etre appele plusieurs fois sans dupliquer.
   Desactive si prefers-reduced-motion.
*/

const REVEAL_SELECTOR = '.reveal, .reveal-stagger, .reveal-fade, .reveal-slide, .reveal-snap';

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
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('is-visible'));
    return;
  }
  document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
    if (!observed.has(el)) {
      observer?.observe(el);
      observed.add(el);
    }
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
  document.addEventListener('astro:page-load', initScrollReveal);
}
