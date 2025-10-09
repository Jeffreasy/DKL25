import { cc, cn, animations } from '@/styles/shared';

/**
 * Modal Base Styles
 * Use shared utilities for consistent modal styling
 * @deprecated Use cc.modal utilities directly from @/styles/shared instead
 */
export const modalBaseStyles = {
  overlay: cn(cc.modal.overlay, 'bg-black/70 backdrop-blur-sm items-start overflow-y-auto'),
  panel: cn('w-full m-4 max-w-lg bg-white rounded-xl overflow-hidden', cc.shadow.xl, animations.slideIn)
} as const;