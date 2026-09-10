/* ==========================================================================
   MOTION TOKENS — SINGLE SOURCE OF TRUTH FOR SITE ANIMATION
   ==========================================================================
   Best One Services is a local London trade-services business. Motion is
   quality-of-life polish only: it must never read as flourish, and it must
   never make the site feel slower than the "instant quote / 2hr dispatch"
   promises in the copy.

   Rules encoded here:
     - Easing is ease-out for entrances and ease-in-out for state changes.
       No bounce, spring, elastic or overshoot curves anywhere.
     - Nothing runs longer than 600ms. The only continuous animation allowed
       on the site is the 2s live-status dot pulse (see globals.css).
     - Scroll reveals move at most 20px and fire once. Content never
       re-animates when the user scrolls back up.
     - Images fade in place. They never scale, zoom or reveal from 0.
   ========================================================================== */

/** Standard ease-out. Decelerating, no overshoot. Entrances. */
export const MOTION_EASE = [0.22, 0.61, 0.36, 1] as const;

/** Symmetric ease-in-out. State changes (accordion, toggles). */
export const MOTION_EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

export const MOTION_DURATION = {
  /** 150ms — hover/colour/opacity feedback. */
  hover: 0.15,
  /** 200ms — small state changes, success checkmark, menu open/close. */
  fast: 0.2,
  /** 250ms — form success/error messages. */
  message: 0.25,
  /** 300ms — accordion expand/collapse. */
  state: 0.3,
  /** 450ms — scroll reveals (spec range 400–600ms). */
  reveal: 0.45,
} as const;

/** Per-item delay inside a staggered group (spec range 60–100ms). */
export const MOTION_STAGGER = {
  fast: 0.06,
  normal: 0.07,
  slow: 0.1,
} as const;

/** Scroll-reveal translateY distance. Spec caps this at 24px. */
export const MOTION_Y_OFFSET = 20;

/**
 * Shared viewport config for every scroll reveal.
 * `once: true` is deliberate — re-animating on scroll-up is distracting and
 * makes long service pages feel unstable.
 */
export const MOTION_VIEWPORT = { once: true, amount: 0.15 } as const;

export const fadeUpVariants = {
  hidden: { opacity: 0, y: MOTION_Y_OFFSET },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.reveal,
      ease: MOTION_EASE,
    },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_STAGGER.normal,
      delayChildren: 0,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: MOTION_Y_OFFSET },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.reveal,
      ease: MOTION_EASE,
    },
  },
};
