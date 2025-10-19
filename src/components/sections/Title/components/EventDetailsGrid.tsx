import React, { memo } from 'react';
import EventDetailCard from './EventDetailCard';

interface EventDetailsGridProps {
  details: Array<{
    title: string;
    description: string;
  }>;
}

const EventDetailsGrid: React.FC<EventDetailsGridProps> = memo(({ details }) => {
  const detailCards = [
    { icon: 'calendar', title: details[0]?.title || '', description: details[0]?.description || '' },
    { icon: 'users', title: details[1]?.title || '', description: details[1]?.description || '' },
    { icon: 'medal', title: details[2]?.title || '', description: details[2]?.description || '' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 max-w-5xl mx-auto" role="list" aria-label="Evenement details">
      {detailCards.map((card, index) => (
        <div key={index} role="listitem">
          <EventDetailCard
            icon={card.icon as 'calendar' | 'users' | 'medal'}
            title={card.title}
            description={card.description}
            index={index}
          />
        </div>
      ))}
    </div>
  );
});

EventDetailsGrid.displayName = 'EventDetailsGrid';

export default EventDetailsGrid;