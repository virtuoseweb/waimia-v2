import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  });
}

export { gsap, ScrollTrigger };

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    ScrollTrigger.refresh();
  });
}
