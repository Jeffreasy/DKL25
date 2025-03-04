import React from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { EventDetail } from '../functions/types';
import { trackEvent } from '@/utils/googleAnalytics';

export const iconMap = {
  calendar: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
  users: <PeopleIcon sx={{ fontSize: 40 }} />,
  medal: <EmojiEventsIcon sx={{ fontSize: 40 }} />
};

interface EventDetailCardProps extends EventDetail {
  titleStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  onClick?: () => void;
  isClickable?: boolean;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ 
  icon, 
  title, 
  description, 
  titleStyle, 
  textStyle,
  onClick,
  isClickable = false
}) => {
  const handleClick = () => {
    if (onClick) {
      trackEvent('event_details', 'detail_click', title);
      onClick();
    }
  };

  return (
    <div
      className={`
        bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300
        ${isClickable ? 'cursor-pointer hover:bg-gray-50' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="text-primary mb-2 transform hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-gray-900 font-semibold text-xl" style={titleStyle}>{title}</h3>
        <p className="text-gray-600" style={textStyle}>{description}</p>
      </div>
    </div>
  );
};

export default EventDetailCard; 