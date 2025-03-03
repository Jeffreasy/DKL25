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
        bg-white/90 hover:bg-white active:bg-gray-100
        py-3 ${direction === 'previous' ? 'pl-4 pr-5' : 'pl-5 pr-4'}
        rounded-full
        shadow-md hover:shadow-lg active:shadow-sm
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-white
        border border-gray-100
        text-gray-700
        touch-manipulation
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        select-none
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'previous' ? 'Vorige video' : 'Volgende video'}
    >
      {direction === 'previous' && (
        <>
          <Icon className="text-xl" />
          <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">
            Vorige
          </span>
        </>
      )}
      {direction === 'next' && (
        <>
          <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">
            Volgende
          </span>
          <Icon className="text-xl" />
        </>
      )}
    </button>
  )
}

export default NavigationButton