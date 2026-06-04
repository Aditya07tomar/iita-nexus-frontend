import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver.
 * Lightweight alternative to framer-motion — zero dependencies.
 * 
 * Usage:
 *   const ref = useScrollAnimation();
 *   <div ref={ref} className="scroll-animate">Content</div>
 * 
 * The element starts invisible (via .scroll-animate CSS class) and
 * gets .visible added when it enters the viewport.
 */
export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold, rootMargin: '-40px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * Hook to observe multiple elements at once.
 * Returns a callback ref to attach to each element.
 */
export function useScrollAnimationGroup(threshold = 0.1) {
  const [observer, setObserver] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold, rootMargin: '-40px' }
    );
    setObserver(obs);
    return () => obs.disconnect();
  }, [threshold]);

  const observe = (node) => {
    if (node && observer) {
      observer.observe(node);
    }
  };

  return observe;
}

export default useScrollAnimation;
