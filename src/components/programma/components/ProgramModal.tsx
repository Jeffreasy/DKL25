import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgramSchedule } from '../hooks/useProgramSchedule';
import ProgramItem from './ProgramItem';
import { ProgramItemData } from '../types';
import LoadingSpinner from '@/components/LoadingSpinner';
import InfoIcon from '@mui/icons-material/Info';

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string; // De tab die initieel geselecteerd moet zijn
  onOpenContactModal: () => void; // <-- Add prop to open contact modal
}

// Reordered TABS array
const TABS = ['Start/Finish/Feest', '15 km', '10 km', '6 km', '2.5 km', 'Alles'];

// Update keywords to be regex patterns for more robust matching
// Using \b for word boundaries and i for case-insensitivity
const KEYWORDS_REGEX_BY_TAB: { [key: string]: RegExp } = {
  '15 km': /\b15\s?km\b/i,
  '10 km': /\b10\s?km\b/i,
  '6 km': /\b6\s?km\b/i,
  '2.5 km': /\b(2[.,]5|2\.5)\s?km\b/i, // Handles both 2,5km and 2.5km
  'Start/Finish/Feest': /\b(start|finish|feest|aanvang|vertrek|aankomst|inhuldiging)\b/i
};

const filterSchedule = (items: ProgramItemData[], tab: string): ProgramItemData[] => {
  if (tab === 'Alles') {
    return items;
  }
  const regex = KEYWORDS_REGEX_BY_TAB[tab];
  if (!regex) {
     // Fallback for tabs without specific regex (should not happen with current TABS)
     // Or handle generic tabs differently if needed
     console.warn(`No regex defined for tab: ${tab}`);
     return [];
  }
  return items.filter(item => regex.test(item.event_description));
};

const ProgramModal: React.FC<ProgramModalProps> = ({ isOpen, onClose, initialTab, onOpenContactModal }) => {
  const { scheduleItems, isLoading, error, refetch } = useProgramSchedule();
  const [activeTab, setActiveTab] = useState<string>(initialTab || TABS[0]);

  // Update activeTab als initialTab verandert terwijl modal open is
  useEffect(() => {
    setActiveTab(initialTab || TABS[0]);
  }, [initialTab]);

  const filteredItems = useMemo(() => {
    return filterSchedule(scheduleItems, activeTab);
  }, [scheduleItems, activeTab]);

  // Effect to handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts or isOpen changes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Sluiten</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Programma DKL 2025
                  </Dialog.Title>
                  <div className="flex flex-col gap-y-3 p-4 mb-4 border border-primary/30 bg-orange-50 rounded-md text-gray-700">
                    <div className="flex items-start gap-x-2">
                      <InfoIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-base font-bold text-primary">
                        DEELNEMERS OPGELET!
                      </p>
                    </div>
                    <div className="ml-7 flex flex-col gap-y-1 text-sm">
                      <p>
                        Hieronder vind je alle informatie en tijden over de Koninklijke Loop. Als je je hebt opgegeven kun je je melden bij het coördinatiepunt bij de Grote Kerk in Apeldoorn.
                      </p>
                      <p className="font-medium">
                        Adres: Loolaan 16, 7315 AB te Apeldoorn.
                      </p>
                       <p className="font-medium">
                         Voor vragen/info: {' '}
                         <button
                            type="button"
                            onClick={onOpenContactModal}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                           neem contact op
                         </button>
                      </p>
                    </div>
                    <ul className="list-disc space-y-1.5 pl-12 text-sm">
                      <li>Tijdens de loop krijg je een lunchpakketje mee, en bij de rustpunten is er fruit & drinken aanwezig. <span className="font-semibold">Neem zelf wel voldoende water mee!</span></li>
                      <li>Bij de Grote kerk kan gebruik worden gemaakt van de toiletten. Er is een invalidetoilet aanwezig. <span className="font-semibold">Houd er rekening mee dat er op de route GEEN TOILETTEN ZIJN!</span></li>
                      <li>Er zijn routebegeleiders en EHBO'ers onderweg. Bij hun kun je altijd terecht voor vragen.</li>
                      <li>We hebben personenvervoer en een rolstoelbus die je naar de startpunten brengt.</li>
                    </ul>
                    <div className="ml-7 mt-2 pt-3 border-t border-orange-200/80"> 
                      <p className="text-sm font-medium mb-2">
                        Meldtijden bij coördinatiepunt ({''}
                        <a 
                          href="https://www.google.com/maps/search/?api=1&query=52.22038,5.95512" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Grote Kerk
                        </a>
                        ): 
                      </p>
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm pl-5">
                        <div className="font-semibold text-right">15 KM:</div> <div>10:15 uur</div>
                        <div className="font-semibold text-right">10 KM:</div> <div>12:00 uur</div>
                        <div className="font-semibold text-right">6 KM:</div>  <div>13:15 uur</div>
                        <div className="font-semibold text-right">2.5 KM:</div> <div>14:30 uur</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-4">
                      <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto pb-2" aria-label="Tabs">
                        {TABS.map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium focus:outline-none ${
                              activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[400px] max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                      {isLoading && (
                          <div className="flex justify-center items-center h-full min-h-[200px]">
                              <LoadingSpinner />
                          </div>
                      )}
                      {error && (
                          <div className="text-center p-10 text-red-600">
                              <p className="mb-4">{error}</p>
                              <button
                                  onClick={() => refetch()} // Add button to trigger refetch
                                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              >
                                  Probeer opnieuw
                              </button>
                          </div>
                      )}
                      {!isLoading && !error && scheduleItems.length === 0 && (
                          <div className="text-center p-10 text-gray-500">Geen programma items gevonden in de database.</div>
                      )}

                      {!isLoading && !error && scheduleItems.length > 0 && (
                         <AnimatePresence mode="wait">
                           <motion.ul
                              key={activeTab}
                              className="relative"
                           >
                              {filteredItems.length > 0 ? (
                                filteredItems.map((item: ProgramItemData, index: number) => (
                                  <ProgramItem
                                    key={item.id}
                                    item={item}
                                    isLast={index === filteredItems.length - 1}
                                    index={index}
                                  />
                                ))
                              ) : (
                                 // Empty state voor de *huidige tab*
                                 <motion.div
                                   className="text-center text-gray-500 py-10"
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   exit={{ opacity: 0 }}
                                 >
                                   <p>Geen items gevonden voor "{activeTab}".</p>
                                 </motion.div>
                              )}
                           </motion.ul>
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </div>
                {/* Optioneel: Footer met sluitknop voor mobiel? */}
                <div className="mt-5 sm:mt-6 sm:hidden">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={onClose}
                    >
                      Sluiten
                    </button>
                  </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProgramModal;
