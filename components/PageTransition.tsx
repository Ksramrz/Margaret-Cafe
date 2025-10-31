import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { pageTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate page in
    pageTransition.enter(containerRef.current);
  }, [router.pathname]);

  return (
    <div ref={containerRef} className="page-transition-container">
      {children}
    </div>
  );
};

export default PageTransition;

