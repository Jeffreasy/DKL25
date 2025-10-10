import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DirectionsWalk, Celebration } from '@mui/icons-material';
import { useModal } from '@/contexts/ModalContext';
import { cc, cn, colors } from '@/styles/shared';

const ROUTE_TABS = ['15 km', '10 km', '6 km', '2.5 km'];

const ProgramSection: React.FC = () => {
  const { handleOpenProgramModal } = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for animations
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
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="programma-sectie"
      className="py-16 sm:py-20 px-4 bg-white overflow-hidden"
      aria-labelledby="programma-title"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="programma-title"
          className={cn(cc.text.h2, 'font-bold text-center text-gray-900 mb-6', cc.typography.heading)}
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          Bekijk het Programma <span className={colors.primary.text}>per Afstand</span>
        </motion.h2>

        {/* --- Route Keuze Knoppen (nu om modal te openen) --- */}
        <motion.div
           className="flex flex-wrap justify-center gap-3 mb-10"
           initial={{ opacity: 0, y: -10 }}
           animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
           transition={{ delay: 0.2, duration: 0.5 }}
        >
           {ROUTE_TABS.map((route) => (
             <button
               key={route}
               onClick={() => {
                 console.log(`ProgramSection: Triggering openProgramModal(${route}) from context`);
                 handleOpenProgramModal(route);
               }}
               className={cn(
                 'inline-flex items-center gap-2 px-4 py-2 font-medium bg-gray-100 text-gray-700 hover:bg-gray-200',
                 cc.text.small,
                 cc.border.circle,
                 cc.transition.fast,
                 cc.shadow.sm,
                 colors.primary.focusRing
               )}
               aria-label={`Bekijk programma voor ${route}`}
             >
               <DirectionsWalk fontSize="small" />
               {route}
             </button>
           ))}
             {/* Optioneel: Knop om modal te openen met "Start/Finish/Feest" of "Alles" */}
            <button
               onClick={() => {
                 console.log(`ProgramSection: Triggering openProgramModal(Start/Finish/Feest) from context`);
                 handleOpenProgramModal('Start/Finish/Feest');
               }}
               className={cn(
                 'inline-flex items-center gap-2 px-4 py-2 font-medium bg-gray-100 text-gray-700 hover:bg-gray-200',
                 cc.text.small,
                 cc.border.circle,
                 cc.transition.fast,
                 cc.shadow.sm,
                 colors.primary.focusRing
               )}
               aria-label="Bekijk start, finish en feest programma"
             >
               <Celebration fontSize="small" />
               Start/Finish/Feest
            </button>
        </motion.div>

         {/* Korte uitleg of link naar volledige schema */}
         <p className={cn('text-center', cc.text.muted, cc.text.small)}>
            Klik op een afstand om het gedetailleerde tijdschema te zien.
         </p>

      </div>
    </section>
  );
};

export default ProgramSection;
