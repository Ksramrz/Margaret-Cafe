import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Simplified - just render children directly without animations that might hide content
  return <>{children}</>;
};

export default PageTransition;

