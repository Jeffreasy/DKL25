import React from 'react';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FlagIcon from '@mui/icons-material/Flag';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import GroupIcon from '@mui/icons-material/Group';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaceIcon from '@mui/icons-material/Place';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { ProgramItem as ProgramItemData } from '../types';
import { cc, cn, colors } from '@/styles/shared';

// Uitgebreidere iconMap gebaseerd op mogelijke category/icon_name waarden
const iconMap: { [key: string]: React.ReactNode } = {
  aanvang: <GroupIcon className={cn('h-5 w-5', colors.primary.text)} />,
  vertrek: <DirectionsBusIcon className={cn('h-5 w-5', colors.primary.text)} />,
  aanwezig: <GroupIcon className={cn('h-5 w-5', colors.primary.text)} />,
  start: <FlagIcon className={cn('h-5 w-5', colors.primary.text)} />,
  rustpunt: <CoffeeIcon className={cn('h-5 w-5', colors.primary.text)} />,
  hervatting: <PlayArrowIcon className={cn('h-5 w-5', colors.primary.text)} />,
  aankomst: <PlaceIcon className={cn('h-5 w-5', colors.primary.text)} />,
  finish: <SportsScoreIcon className={cn('h-5 w-5', colors.primary.text)} />,
  inhuldiging: <CelebrationIcon className={cn('h-5 w-5', colors.primary.text)} />,
  feest: <CelebrationIcon className={cn('h-5 w-5', colors.primary.text)} />,
  bus: <DirectionsBusIcon className={cn('h-5 w-5', colors.primary.text)} />,
  default: <AccessTimeIcon className={cn('h-5 w-5', colors.primary.text)} />,
};

interface ProgramItemProps {
  item: ProgramItemData;
  isLast: boolean;
  index: number;
}

const ProgramItem: React.FC<ProgramItemProps> = ({ item, isLast, index }) => {
  const iconKey = item.icon_name || item.category?.toLowerCase() || 'default';
  const icon = iconMap[iconKey] || iconMap.default;

  const itemVariants = {
    hidden: { opacity: 0, x: -30 }, // Start iets verder naar links
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.07,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  // Highlight key moments like START, FINISH, FEEST
  const isKeyMoment = ['start', 'finish', 'feest', 'inhuldiging'].includes(iconKey);

  return (
    <motion.li
      className="relative pl-16" // Meer padding voor de icon cirkel + lijn
      variants={itemVariants}
      layout // Enable layout animations
    >
      {/* Tijdlijn Lijn (niet voor laatste item) */}
      {!isLast && (
        <span
          className="absolute left-[21px] top-[2.125rem] bottom-[-0.5rem] w-0.5 bg-gradient-to-b from-orange-200 via-orange-100 to-orange-50"
          aria-hidden="true"
        />
      )}

      {/* Tijdlijn Cirkel met Icoon */}
      <div className={cn(
        'absolute left-0 top-[0.625rem] h-11 w-11 ring-4',
        cc.flex.center,
        cc.border.circle,
        cc.shadow.md,
        isKeyMoment ? cn(colors.primary.bg, 'ring-primary/30') : 'bg-gray-200 ring-gray-100'
      )}>
        {/* Pas icon kleur aan op basis van key moment */}
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: cn('h-6 w-6', isKeyMoment ? 'text-white' : 'text-gray-600')
        })}
      </div>

      {/* Content */}
      <div className="pb-8">
        <div className={cn(cc.text.body, 'font-semibold leading-7', isKeyMoment ? colors.primary.text : 'text-gray-900')}>
          {item.time}
        </div>
        <div className={cn('mt-1 leading-6', cc.text.small, cc.text.muted)}>
          {item.event_description}
        </div>
        {/* Google Maps Link */} 
        {item.latitude && item.longitude && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn('mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline', cc.transition.colors)}
          >
             <LocationOnIcon className="h-4 w-4 mr-1" />
             Bekijk op kaart
          </a>
        )}
      </div>
    </motion.li>
  );
};

export default ProgramItem;
