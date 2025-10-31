import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !cursorRef.current || !cursorFollowerRef.current) return;

    const cursor = cursorRef.current;
    const follower = cursorFollowerRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0,
      });
    };

    const updateFollower = () => {
      const speed = 0.15;
      followerX += (mouseX - followerX) * speed;
      followerY += (mouseY - followerY) * speed;

      gsap.to(follower, {
        x: followerX,
        y: followerY,
        duration: 0.3,
        ease: 'power2.out',
      });

      requestAnimationFrame(updateFollower);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        gsap.to(cursor, { scale: 1.5, opacity: 0.8 });
        gsap.to(follower, { scale: 2, opacity: 0.3 });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, opacity: 1 });
      gsap.to(follower, { scale: 1, opacity: 0.2 });
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    updateFollower();

    // Hide on mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      cursor.style.display = 'none';
      follower.style.display = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-cafe-green rounded-full pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-cafe-green rounded-full pointer-events-none z-[9998] opacity-20 transform -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;

