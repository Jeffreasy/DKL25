import React from 'react';
import { motion } from 'framer-motion';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useModal } from '@/contexts/ModalContext';

const ROUTE_TABS = ['15 km', '10 km', '6 km', '2.5 km'];

const ProgramSection: React.FC = () => {
  const { handleOpenProgramModal } = useModal();

  return (
    <section id="programma-sectie" className="py-16 sm:py-20 px-4 bg-white overflow-hidden" aria-labelledby="programma-title">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="programma-title"
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-6 font-heading"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Bekijk het Programma <span className="text-primary">per Afstand</span>
        </motion.h2>

        {/* --- Route Keuze Knoppen (nu om modal te openen) --- */}
        <motion.div
           className="flex flex-wrap justify-center gap-3 mb-10"
           initial={{ opacity: 0, y: -10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, amount: 0.3 }}
           transition={{ delay: 0.2, duration: 0.5 }}
        >
           {ROUTE_TABS.map((route) => (
             <button
               key={route}
               onClick={() => {
                 console.log(`ProgramSection: Triggering openProgramModal(${route}) from context`);
                 handleOpenProgramModal(route);
               }}
               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
               aria-label={`Bekijk programma voor ${route}`}
             >
               <DirectionsWalkIcon fontSize="small" />
               {route}
             </button>
           ))}
             {/* Optioneel: Knop om modal te openen met "Start/Finish/Feest" of "Alles" */}
            <button
               onClick={() => {
                 console.log(`ProgramSection: Triggering openProgramModal(Start/Finish/Feest) from context`);
                 handleOpenProgramModal('Start/Finish/Feest');
               }}
               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
               aria-label="Bekijk start, finish en feest programma"
             >
               <CelebrationIcon fontSize="small" />
               Start/Finish/Feest
            </button>
        </motion.div>

         {/* Korte uitleg of link naar volledige schema */}
         <p className="text-center text-gray-500 text-sm">
            Klik op een afstand om het gedetailleerde tijdschema te zien.
         </p>

      </div>
    </section>
  );
};

export default ProgramSection;
