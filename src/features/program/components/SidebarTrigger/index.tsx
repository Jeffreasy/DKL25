import React, { memo, Suspense, lazy, useState, useEffect, useRef } from 'react';

// Lazy load trigger components for better performance
const MobileTrigger = lazy(() => import('./MobileTrigger'));
const TabletTrigger = lazy(() => import('./TabletTrigger'));
const DesktopTrigger = lazy(() => import('./DesktopTrigger'));

// Renamed prop interface
interface ProgramSidebarTriggerProps {
  onOpenModal: () => void;
}

// Main component that renders the correct trigger based on screen size
const ProgramSidebarTrigger: React.FC<ProgramSidebarTriggerProps> = memo(({ onOpenModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading triggers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Only trigger once
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <Suspense fallback={null}>
        {/* Visible only on small screens (up to sm breakpoint) */}
        <div className="block sm:hidden">
          {isVisible && <MobileTrigger onOpenModal={onOpenModal} />}
        </div>

        {/* Visible only on medium screens (sm to md breakpoint) */}
        <div className="hidden sm:block md:hidden">
          {isVisible && <TabletTrigger onOpenModal={onOpenModal} />}
        </div>

        {/* Visible only on large screens (md and up) */}
        <div className="hidden md:block">
          {isVisible && <DesktopTrigger onOpenModal={onOpenModal} />}
        </div>
      </Suspense>
    </div>
  );
});

ProgramSidebarTrigger.displayName = 'ProgramSidebarTrigger';

export default ProgramSidebarTrigger;