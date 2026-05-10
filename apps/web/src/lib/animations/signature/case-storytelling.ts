import { gsap, ScrollTrigger } from '../gsap-init';

export function initCaseStorytelling(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Effect 1: Parallax discret SVG hero -20% */
  gsap.utils.toArray<HTMLElement>('.case-hero-decoration').forEach((el) => {
    const hero = el.closest('.case-hero');
    if (!hero) return;
    gsap.to(el, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });

  /* Effect 2: Stacked cards autres cas clients */
  gsap.utils.toArray<HTMLElement>('.related-case-card').forEach((card) => {
    gsap.fromTo(
      card,
      { y: 80, scale: 0.95, opacity: 0.6 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          end: 'top center+=100',
          scrub: 1,
        },
      }
    );
  });

  /* Effect 3: Progress bar terracotta hairline */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        scrub: true,
      },
    });
  }
}
