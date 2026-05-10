import { gsap, ScrollTrigger } from '../gsap-init';

export function initHomepageNarrative(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Effect 1: Duplicate-text reveal H1 hero */
  const heroH1 = document.querySelector('.home-hero h1');
  if (heroH1) {
    gsap.from('.home-hero .text-duplicate-top', {
      yPercent: -100,
      ease: 'power3.out',
      duration: 1.2,
    });
    gsap.from('.home-hero .text-duplicate-bottom', {
      yPercent: 100,
      ease: 'power3.out',
      duration: 1.2,
      delay: 0.1,
    });
  }

  /* Effect 2: Sticky section reveals — services pinned */
  gsap.utils.toArray<HTMLElement>('.home-services-section').forEach((section) => {
    const content = section.querySelector('.section-content');
    if (!content) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top top+=80',
      end: '+=600',
      pin: true,
      pinSpacing: true,
      onEnter: () => {
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      },
      onLeaveBack: () => {
        gsap.to(content, {
          opacity: 0,
          y: 20,
          duration: 0.4,
        });
      },
    });
  });

  /* Effect 3: Marquee page border */
  const marquee = document.querySelector('.marquee-border');
  if (marquee) {
    const content = marquee.querySelector('.marquee-content') as HTMLElement | null;
    if (content) {
      gsap.to(content, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: 'none',
      });
    }
  }
}
