import React from 'react';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FlagIcon from '@mui/icons-material/Flag';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import GroupIcon from '@mui/icons-material/Group';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Voor Hervatting
import PlaceIcon from '@mui/icons-material/Place'; // Voor locaties zoals De Naald
import type { ProgramItemData } from '../types';

// Uitgebreidere iconMap gebaseerd op mogelijke category/icon_name waarden
const iconMap: { [key: string]: React.ReactNode } = {
  aanvang: <GroupIcon className="h-5 w-5 text-primary" />,
  vertrek: <DirectionsBusIcon className="h-5 w-5 text-primary" />,
  aanwezig: <GroupIcon className="h-5 w-5 text-primary" />,
  start: <FlagIcon className="h-5 w-5 text-primary" />,
  rustpunt: <CoffeeIcon className="h-5 w-5 text-primary" />,
  hervatting: <PlayArrowIcon className="h-5 w-5 text-primary" />,
  aankomst: <PlaceIcon className="h-5 w-5 text-primary" />,
  finish: <SportsScoreIcon className="h-5 w-5 text-primary" />,
  inhuldiging: <CelebrationIcon className="h-5 w-5 text-primary" />,
  feest: <CelebrationIcon className="h-5 w-5 text-primary" />,
  bus: <DirectionsBusIcon className="h-5 w-5 text-primary" />, // Extra alias
  default: <AccessTimeIcon className="h-5 w-5 text-primary" />,
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
        ease: "easeOut"
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
      <div className={`absolute left-0 top-[0.625rem] flex h-11 w-11 items-center justify-center rounded-full ${isKeyMoment ? 'bg-primary ring-primary/30' : 'bg-gray-200 ring-gray-100'} ring-4 shadow-md`}>
        {/* Pas icon kleur aan op basis van key moment */}
        {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${isKeyMoment ? 'text-white' : 'text-gray-600'}` })}
      </div>

      {/* Content */}
      <div className="pb-8">
        <div className={`text-base font-semibold leading-7 ${isKeyMoment ? 'text-primary' : 'text-gray-900'}`}>
          {item.time}
        </div>
        <div className="mt-1 text-sm leading-6 text-gray-600">
          {item.event_description}
        </div>
      </div>
    </motion.li>
  );
};

export default ProgramItem;
