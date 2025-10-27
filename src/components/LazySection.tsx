import React from 'react';
import { useLazySection } from '../utils/lazyLoader';

interface LazySectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  threshold?: number;
  fallback?: React.ReactNode;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  id,
  className,
  threshold = 0.1,
  fallback = <div style={{ minHeight: '200px' }} />
}) => {
  const { ref, isVisible } = useLazySection(threshold);

  return (
    <section ref={ref} id={id} className={className}>
      {isVisible ? children : fallback}
    </section>
  );
};

export default LazySection;