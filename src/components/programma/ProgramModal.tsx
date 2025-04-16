import React, { useState, useMemo } from 'react';
import { useProgramSchedule } from '../../hooks/useProgramSchedule';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgramItem } from './ProgramItem';

const ProgramModal: React.FC = () => {
  const { scheduleItems, isLoading, error, refetch } = useProgramSchedule();
  const [activeTab, setActiveTab] = useState<string>(initialTab || TABS[0]);

  // --- DEBUG LOGS --- 
  console.log('ProgramModal Render:', {
    isOpen,
    initialTab,
    activeTab,
    isLoading,
    error,
    scheduleItemsCount: scheduleItems.length
  });
  // --- END DEBUG LOGS ---

  // Update activeTab als initialTab verandert terwijl modal open is (edge case)
  // ... (rest of useEffect)

  const filteredItems = useMemo(() => {
    const result = filterSchedule(scheduleItems, activeTab);
    // --- DEBUG LOGS --- 
    console.log(`Filtering for tab: ${activeTab}`, { 
      inputCount: scheduleItems.length, 
      outputCount: result.length 
    });
    // --- END DEBUG LOGS ---
    return result;
  }, [scheduleItems, activeTab]);

  // ... (rest of the component) ...

  return (
    <div>
      {!isLoading && !error && scheduleItems.length > 0 && (
        <AnimatePresence mode="wait"> 
          <motion.ul
            key={activeTab} 
            className="relative"
            variants={containerVariants}
            {...listAnimationProps}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                // --- DEBUG LOGS --- 
                console.log(`Rendering ProgramItem ${index} for tab ${activeTab}:`, item.time, item.event_description);
                // --- END DEBUG LOGS ---
                return (
                  <ProgramItem
                    key={item.id}
                    item={item}
                    isLast={index === filteredItems.length - 1}
                    index={index}
                  />
                );
              })
            ) : (
              // Empty state voor de *huidige tab*
              <motion.div 
                className="text-center text-gray-500 py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* --- DEBUG LOGS --- */}
                {console.log(`Rendering empty state for tab ${activeTab}`)}
                {/* --- END DEBUG LOGS --- */}
                <p>Geen items gevonden voor "{activeTab}".</p>
              </motion.div>
            )}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProgramModal; 