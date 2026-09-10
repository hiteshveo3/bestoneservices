"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal binding for server-rendered markup.
 *
 * Most of this site is server components, so wrapping every heading in a
 * Framer Motion client component would ship a client boundary per section
 * for a 450ms fade. Instead any element opts in with a plain attribute:
 *
 *   <h2 data-reveal>            single fade-up
 *   <div data-reveal-group>     children fade up in sequence
 *
 * Timings live in globals.css and mirror motion-tokens.ts exactly, so the
 * attribute API and the Framer Motion components are one system.
 *
 * Mounted once in the root layout.
 *
 * FAILING SAFE IS THE WHOLE DESIGN HERE. This mechanism hides real content
 * — a service page's headings and cards — so any path where the reveal
 * never runs is a blank page for a customer, which is far worse than no
 * animation at all. Three independent guards:
 *
 *  1. The hiding CSS is scoped to <html class="js-reveal">, added only by
 *     this component. No JS, a failed bundle, or an old browser means
 *     nothing is ever hidden.
 *  2. prefers-reduced-motion short-circuits before that class is added, so
 *     those users get plain, instant content and no observer at all.
 *  3. A passive scroll/resize pass runs the same rect check as a backstop.
 *     IntersectionObserver callbacks can be withheld while a tab or window
 *     is hidden or throttled; if a user scrolls in that state, the geometry
 *     check still reveals the content. Both paths are idempotent.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    root.classList.add("js-reveal");

    const SELECTOR =
      "[data-reveal]:not(.is-revealed), [data-reveal-group]:not(.is-revealed)";

    const reveal = (el: Element) => {
      el.classList.add("is-revealed");
      observer.unobserve(el);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target);
        }
      },
      // Trimming the bottom starts the fade just before the element reaches
      // the fold, so it is finished by the time the user is looking at it
      // rather than fading in under their eyes.
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    /** Reveal anything at or near the fold; observe whatever is still below. */
    const sweep = () => {
      const limit = window.innerHeight * 0.92;
      document.querySelectorAll(SELECTOR).forEach((el) => {
        // Anything already on screen is above the fold as far as this user is
        // concerned: show it now rather than making it wait on a callback.
        if (el.getBoundingClientRect().top < limit) {
          reveal(el);
          return;
        }
        observer.observe(el);
      });
    };

    sweep();

    // Time-based throttle rather than requestAnimationFrame: rAF is paused
    // whenever the page is not being painted, which is exactly the state
    // that also withholds IntersectionObserver callbacks. Tying the backstop
    // to rAF would make both guards fail together, which defeats the point.
    let last = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const now = Date.now();
      const since = now - last;
      if (since >= 100) {
        last = now;
        sweep();
        return;
      }
      // Always settle on a final pass so a scroll that stops inside the
      // throttle window still reveals what it landed on.
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = Date.now();
        sweep();
      }, 100 - since);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Coming back to a backgrounded tab: catch up on anything scrolled past
    // while callbacks were being withheld.
    document.addEventListener("visibilitychange", onScroll);

    // Client-side navigation swaps the tree without remounting the layout.
    const mutations = new MutationObserver(onScroll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
