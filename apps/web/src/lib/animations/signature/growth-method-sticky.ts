import { gsap, ScrollTrigger } from '../gsap-init';

export function initGrowthMethodSticky(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Effect 1: Section Méthode sticky pendant 5 phases */
  const methodSection = document.querySelector('.sol-method');
  if (methodSection) {
    const phases = methodSection.querySelectorAll('.timeline-item');
    const eyebrow = methodSection.querySelector('.section-eyebrow');

    if (eyebrow && phases.length > 0) {
      ScrollTrigger.create({
        trigger: methodSection,
        start: 'top top+=80',
        end: () => `+=${phases.length * 300}`,
        pin: eyebrow,
        pinSpacing: false,
      });
    }

    phases.forEach((phase) => {
      const phaseEl = phase as HTMLElement;
      gsap.fromTo(
        phaseEl,
        { opacity: 0.3, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: phaseEl,
            start: 'top center+=100',
            end: 'top center-=50',
            scrub: 1,
            onLeave: () => phaseEl.classList.add('timeline-item-highlight'),
            onEnterBack: () => phaseEl.classList.remove('timeline-item-highlight'),
          },
        }
      );
    });
  }

  /* Effect 2: Scroll-driven progress bar terracotta hairline */
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
