import React, { memo } from 'react'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { cc, cn, colors } from '@/styles/shared'

interface NavigationButtonProps {
  direction: 'previous' | 'next'
  onClick: () => void
  disabled?: boolean
}

const NavigationButton: React.FC<NavigationButtonProps> = memo(({ direction, onClick, disabled }) => {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  
  return (
    <button
      className={cn(
        cc.flex.start,
        'gap-1.5 bg-white/90 hover:bg-white active:bg-gray-100',
        `py-3 ${direction === 'previous' ? 'pl-4 pr-5' : 'pl-5 pr-4'}`,
        cc.border.circle,
        cc.shadow.md,
        'hover:shadow-lg active:shadow-sm',
        cc.transition.base,
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-white',
        'border border-gray-100 text-gray-700 touch-manipulation select-none',
        colors.primary.focusRing
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'previous' ? 'Vorige video' : 'Volgende video'}
    >
      {direction === 'previous' && (
        <>
          <Icon className="text-xl" />
          <span className={cn(cc.text.small, 'font-medium whitespace-nowrap hidden sm:inline')}>
            Vorige
          </span>
        </>
      )}
      {direction === 'next' && (
        <>
          <span className={cn(cc.text.small, 'font-medium whitespace-nowrap hidden sm:inline')}>
            Volgende
          </span>
          <Icon className="text-xl" />
        </>
      )}
    </button>
  )
})

NavigationButton.displayName = 'NavigationButton'

export default NavigationButton