import React, { memo } from 'react'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { cc, cn, colors } from '@/styles/shared'

interface NavigationButtonProps {
  direction: 'previous' | 'next'
  onClick: () => void
  disabled?: boolean
}

const NavigationButton: React.FC<NavigationButtonProps> = memo(({ direction, onClick, disabled }) => {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  const isPrevious = direction === 'previous'
  
  return (
    <button
      className={cn(
        cc.flex.center,
        'gap-2',
        'bg-white',
        'hover:bg-gray-50 active:bg-gray-100',
        'px-5 py-3.5',
        cc.border.circle,
        cc.shadow.lg,
        'hover:shadow-xl active:shadow-md',
        cc.transition.base,
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-lg',
        'border-2 border-gray-200/50 hover:border-primary/30',
        'text-gray-700 hover:text-primary',
        'touch-manipulation select-none',
        'backdrop-blur-sm',
        'transform hover:scale-105 active:scale-95',
        colors.primary.focusRing,
        'group'
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrevious ? 'Vorige video' : 'Volgende video'}
    >
      {isPrevious && (
        <>
          <Icon 
            className={cn(
              'text-2xl transition-transform',
              'group-hover:-translate-x-0.5'
            )} 
          />
          <span className={cn(
            cc.text.small, 
            'font-semibold whitespace-nowrap hidden sm:inline transition-opacity',
            'group-hover:text-primary'
          )}>
            Vorige
          </span>
        </>
      )}
      {!isPrevious && (
        <>
          <span className={cn(
            cc.text.small, 
            'font-semibold whitespace-nowrap hidden sm:inline transition-opacity',
            'group-hover:text-primary'
          )}>
            Volgende
          </span>
          <Icon 
            className={cn(
              'text-2xl transition-transform',
              'group-hover:translate-x-0.5'
            )} 
          />
        </>
      )}
    </button>
  )
})

NavigationButton.displayName = 'NavigationButton'

export default NavigationButton