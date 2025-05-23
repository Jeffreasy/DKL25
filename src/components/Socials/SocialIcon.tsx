import React from 'react';
import type { SocialLink } from './types';

interface SocialIconProps {
  platform: SocialLink['platform'];
  className?: string;
  showTooltip?: boolean;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  className = '',
  showTooltip = true
}) => {
  const platformNames = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn'
  };

  const icons = {
    facebook: (
      <path fill="currentColor" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4V13.5z" />
    ),
    instagram: (
      <path fill="currentColor" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    ),
    youtube: (
      <path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    ),
    linkedin: (
      <path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
    )
  };

  return (
    <div className="relative group">
      <svg 
        className={`${className} transform-gpu`} 
        viewBox="0 0 24 24"
        role="img"
        aria-label={`${platformNames[platform]} icon`}
      >
        {icons[platform]}
      </svg>
      
      {showTooltip && (
        <div className="
          absolute -bottom-8 left-1/2 -translate-x-1/2
          px-2 py-1 rounded bg-gray-900/90 text-white text-xs
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
          whitespace-nowrap
          backdrop-blur-sm
          shadow-lg
          z-50
        ">
          {platformNames[platform]}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900/90" />
        </div>
      )}
    </div>
  );
};

export default React.memo(SocialIcon); 