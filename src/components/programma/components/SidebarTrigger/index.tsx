import React from 'react';
import MobileTrigger from './MobileTrigger';
import TabletTrigger from './TabletTrigger';
import DesktopTrigger from './DesktopTrigger';

// Renamed prop interface
interface ProgramSidebarTriggerProps {
  onOpenModal: () => void;
}

// Main component that renders the correct trigger based on screen size
// Renamed prop deconstruction
const ProgramSidebarTrigger: React.FC<ProgramSidebarTriggerProps> = ({ onOpenModal }) => {
  return (
    <>
      {/* Visible only on small screens (up to sm breakpoint) */}
      <div className="block sm:hidden">
        {/* Passed renamed prop */}
        <MobileTrigger onOpenModal={onOpenModal} />
      </div>

      {/* Visible only on medium screens (sm to md breakpoint) */}
      <div className="hidden sm:block md:hidden">
         {/* Passed renamed prop */}
         <TabletTrigger onOpenModal={onOpenModal} />
      </div>

      {/* Visible only on large screens (md and up) */}
      <div className="hidden md:block">
        {/* Passed renamed prop - Desktop needs update too */}
        <DesktopTrigger onOpenModal={onOpenModal} />
      </div>
    </>
  );
};

export default ProgramSidebarTrigger; 