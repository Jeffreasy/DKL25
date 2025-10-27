import React, { useEffect, useState, useRef, memo, Suspense } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Optimized section component with intersection observer
 * Lazy loads content based on viewport visibility and priority
 * 
 * @param {React.ReactNode} children - Content to lazy load
 * @param {React.ReactNode} fallback - Loading fallback UI
 * @param {string} className - Additional CSS classes
 * @param {'high' | 'medium' | 'low'} priority - Loading priority (high loads immediately)
 */
export const LazySection: React.FC<LazySectionProps> = memo(
  ({ children, fallback, className, priority = 'medium' }) => {
    const [isVisible, setIsVisible] = useState(priority === 'high');
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (priority === 'high') return; // High priority loads immediately

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect(); // Load once
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: priority === 'medium' ? '100px' : '200px',
        }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    }, [priority]);

    return (
      <div ref={sectionRef} className={className}>
        <Suspense
          fallback={
            fallback || (
              <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
            )
          }
        >
          {isVisible ? (
            children
          ) : (
            fallback || <div className="h-32 bg-gray-50 rounded-lg" />
          )}
        </Suspense>
      </div>
    );
  }
);

LazySection.displayName = 'LazySection';