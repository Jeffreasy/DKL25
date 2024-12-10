import React from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

interface NavigationButtonProps {
  direction: 'previous' | 'next'
  onClick: () => void
  disabled?: boolean
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ direction, onClick, disabled }) => {
  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon
  
  return (
    <button
      className={`
        flex items-center gap-1.5
        bg-white/90 hover:bg-white
        py-2 ${direction === 'previous' ? 'pl-3 pr-4' : 'pl-4 pr-3'}
        rounded-full
        shadow-md hover:shadow-lg
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        border border-gray-100
        text-gray-700
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'previous' ? 'Vorige video' : 'Volgende video'}
    >
      {direction === 'previous' && <Icon className="text-lg" />}
      <span className="text-sm font-medium whitespace-nowrap">
        {direction === 'previous' ? 'Vorige' : 'Volgende'}
      </span>
      {direction === 'next' && <Icon className="text-lg" />}
    </button>
  )
}

export default NavigationButton