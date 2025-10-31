import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAP = (
  animationFn: (ctx: gsap.Context) => void,
  dependencies: any[] = []
) => {
  const containerRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      animationFn(ctx);
    }, containerRef.current);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
    };
  }, dependencies);

  return containerRef;
};

export const useScrollTrigger = (
  trigger: RefObject<HTMLElement>,
  animation: gsap.TweenVars,
  options?: ScrollTrigger.Vars
) => {
  useEffect(() => {
    if (!trigger.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger.current,
        ...options,
      },
    });

    tl.to(trigger.current, animation);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [trigger]);
};

export const useMagnetic = (elementRef: RefObject<HTMLElement>, strength: number = 0.3) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, strength]);
};

