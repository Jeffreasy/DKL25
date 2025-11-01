/**
 * Image Lightbox Component
 * Full-screen modal for viewing photos with zoom, pan, and navigation
 *
 * Features:
 * - Click to zoom/unzoom
 * - Pan when zoomed
 * - Keyboard navigation (arrows, space, escape)
 * - Touch gestures (swipe, pinch)
 * - Focus trap for accessibility
 */

import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import type { Photo } from '../types';
import { useSwipe } from '@/hooks/useSwipe';
import { trackEvent } from '@/utils/googleAnalytics';
import { shouldHandleKeyboardEvent } from '@/utils/eventUtils';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors } from '@/styles/shared';

interface ImageModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  totalPhotos?: number;
  currentIndex?: number;
}

const ImageModal: React.FC<ImageModalProps> = memo(({
  photo,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  totalPhotos,
  currentIndex
}) => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('ImageModal');

  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null); // Ref voor de afbeelding zelf

  // State voor zoom en pan
  const [scale, setScale] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, initialX: 0, initialY: 0 });

  // Functie om state te resetten (wordt op meerdere plaatsen gebruikt)
  const resetZoomAndPan = useCallback(() => {
    setIsZoomed(false);
    setScale(1);
    setDragPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  // handleClose reset nu ook zoom/pan
  const handleClose = useCallback(() => {
    setIsClosing(true);
    trackInteraction('modal_closed', `photo_${currentIndex}`);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      resetZoomAndPan(); // Reset hier
    }, 200);
  }, [onClose, currentIndex, resetZoomAndPan, trackInteraction]);

  // Track modal open/close
  useEffect(() => {
    if (isOpen) {
      trackInteraction('modal_opened', `photo_${currentIndex}`);
    }
  }, [isOpen, currentIndex, trackInteraction]);

  // Swipe handling (blijft grotendeels, maar reset zoom bij navigeren)
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: useCallback(() => {
      resetZoomAndPan(); // Reset bij navigeren
      trackInteraction('modal_swipe', 'left');
      onNext?.();
    }, [resetZoomAndPan, trackInteraction, onNext]),
    onSwipeRight: useCallback(() => {
      resetZoomAndPan(); // Reset bij navigeren
      trackInteraction('modal_swipe', 'right');
      onPrevious?.();
    }, [resetZoomAndPan, trackInteraction, onPrevious]),
    onSwipeDown: useCallback(() => {
      if (!isZoomed) { // Alleen sluiten als niet ingezoomd
          trackInteraction('modal_swipe', 'down');
          handleClose();
      }
    }, [isZoomed, trackInteraction, handleClose]),
    onSwipeUp: useCallback(() => {
        if (!isZoomed) { // Alleen sluiten als niet ingezoomd
            trackInteraction('modal_swipe', 'up');
            handleClose();
        }
    }, [isZoomed, trackInteraction, handleClose]),
    threshold: 50,
  });

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!shouldHandleKeyboardEvent()) {
      return;
    }

    switch (e.key) {
      case 'Escape':
        trackInteraction('modal_keyboard', 'escape');
        handleClose();
        break;
      case 'ArrowLeft':
        resetZoomAndPan();
        trackInteraction('modal_keyboard', 'left');
        onPrevious?.();
        break;
      case 'ArrowRight':
        resetZoomAndPan();
        trackInteraction('modal_keyboard', 'right');
        onNext?.();
        break;
      case ' ':
        e.preventDefault();
        // Toggle zoom
        if (isZoomed) {
          resetZoomAndPan();
        } else {
          setIsZoomed(true);
          setScale(2);
          setDragPosition({ x: 0, y: 0 });
        }
        trackInteraction('modal_zoom', isZoomed ? 'out' : 'in');
        break;
      default:
        break;
    }
  }, [handleClose, onNext, onPrevious, isZoomed, resetZoomAndPan, trackInteraction]);

  // Keyboard navigation effect
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Reset states wanneer foto verandert
  useEffect(() => {
    resetZoomAndPan(); // Gebruik reset functie
    setIsLoading(true);
  }, [photo?.url, resetZoomAndPan]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    trackInteraction('modal_image_loaded', `photo_${currentIndex}`);
  }, [trackInteraction, currentIndex]);

  // Klik om te zoomen op het geklikte punt, of uit te zoomen
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    const imgElement = imgRef.current;
    if (!imgElement) return;

    if (isZoomed) {
      // Uitzoomen
      resetZoomAndPan();
      trackInteraction('modal_zoom', 'out');
    } else {
      // --- Inzoomen op geklikt punt (herziene logica v2) ---
      const rect = imgElement.getBoundingClientRect();
      const { naturalWidth, naturalHeight } = imgElement;
      const imgAspectRatio = naturalWidth / naturalHeight;
      const containerAspectRatio = rect.width / rect.height;
      let renderedWidth, renderedHeight, offsetX, offsetY;

      if (imgAspectRatio > containerAspectRatio) {
        renderedWidth = rect.width;
        renderedHeight = rect.width / imgAspectRatio;
        offsetX = 0;
        offsetY = (rect.height - renderedHeight) / 2;
      } else {
        renderedHeight = rect.height;
        renderedWidth = rect.height * imgAspectRatio;
        offsetX = (rect.width - renderedWidth) / 2;
        offsetY = 0;
      }

      const clickXOnRendered = e.clientX - rect.left - offsetX;
      const clickYOnRendered = e.clientY - rect.top - offsetY;

      if (clickXOnRendered < 0 || clickXOnRendered > renderedWidth || clickYOnRendered < 0 || clickYOnRendered > renderedHeight) {
        setIsZoomed(true);
        setScale(2);
        setDragPosition({ x: 0, y: 0 });
        trackInteraction('modal_zoom', 'in_center');
        return;
      }

      // Gebruik de klikpositie DIRECT op de gerenderde afbeelding
      // We willen dat het punt (clickXOnRendered, clickYOnRendered) 
      // na het schalen met newScale (vanuit origin 0,0) 
      // eindigt op de positie (e.clientX - rect.left, e.clientY - rect.top) RELATIEF tot de img container.
      const newScale = 2;
      // targetX = newX + clickXOnRendered * newScale
      // targetY = newY + clickYOnRendered * newScale
      // We willen targetX = e.clientX - rect.left, etc.
      const targetX = e.clientX - rect.left;
      const targetY = e.clientY - rect.top;

      const newX = targetX - clickXOnRendered * newScale;
      const newY = targetY - clickYOnRendered * newScale;

      setIsZoomed(true);
      setScale(newScale);
      setDragPosition({ x: newX, y: newY });
      trackInteraction('modal_zoom', 'in_point');
    }
  }, [isZoomed, resetZoomAndPan, trackInteraction]);

  // Start dragging
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({
      x: clientX,
      y: clientY,
      initialX: dragPosition.x,
      initialY: dragPosition.y
    });
  }, [isZoomed, dragPosition.x, dragPosition.y]);

  // Update drag position
  const handleDragging = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragPosition({
      x: dragStart.initialX + deltaX,
      y: dragStart.initialY + deltaY
    });
  }, [isDragging, dragStart]);

  // End dragging
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      trackInteraction('modal_pan', `x:${dragPosition.x.toFixed(0)},y:${dragPosition.y.toFixed(0)}`);
    }
  }, [isDragging, dragPosition.x, dragPosition.y, trackInteraction]);

  // Mouse events for dragging
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLImageElement>) => handleDragStart(e.clientX, e.clientY), [handleDragStart]);
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => handleDragging(e.clientX, e.clientY), [handleDragging]);
  const onMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);
  const onMouseLeave = useCallback(() => handleDragEnd(), [handleDragEnd]);

  // Touch events for dragging
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleDragStart]);
  const onTouchMove = useCallback((e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 1) {
      handleDragging(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleDragging]);
  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  // Conditionally render to avoid FocusTrap issues with invisible elements
  if (!isOpen || !photo) return null;

  const photoLabel = photo.alt_text || `Foto ${currentIndex !== undefined ? currentIndex + 1 : ''}`;

  return (
    <FocusTrap active={true} focusTrapOptions={{ initialFocus: false }}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={photoLabel}
        className={cn(
          'fixed inset-0',
          'bg-black/90',
          'backdrop-blur-sm',
          cc.zIndex.modal,
          cc.flex.center,
          cc.transition.fast,
          !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
        onClick={handleClose}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Top gradient overlay */}
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-16',
            'bg-gradient-to-b from-black/50 to-transparent'
          )}
          onClick={handleClose}
          aria-hidden="true"
        />

        <div 
          className="relative w-full h-full p-4 md:p-8 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            ref={(node) => {
                if (node && isOpen && modalRef.current && !modalRef.current.contains(document.activeElement)) {
                    node.focus();
                }
            }}
            type="button"
            onClick={handleClose}
            className={cn(
              'absolute top-6 right-6 p-3 text-white group',
              cc.zIndex.dropdown,
              cc.border.circle,
              'bg-black/50 hover:bg-black/70',
              cc.transition.fast,
              'hover:scale-110',
              colors.primary.focusRing
            )}
            aria-label="Sluit afbeelding"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn('h-6 w-6 transform', cc.transition.fast, 'group-hover:rotate-90')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {onPrevious && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPrevious(); }}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white',
                cc.border.circle,
                'bg-black/50 hover:bg-black/70',
                cc.transition.fast,
                'hover:scale-110 hover:translate-x-[-4px]',
                colors.primary.focusRing
              )}
              aria-label="Vorige foto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white',
                cc.border.circle,
                'bg-black/50 hover:bg-black/70',
                cc.transition.fast,
                'hover:scale-110 hover:translate-x-[4px]',
                colors.primary.focusRing
              )}
              aria-label="Volgende foto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image container */}
          <div className={cn(cc.flex.center, 'flex-1 overflow-hidden')}>
            {isLoading && (
              <div className={cn(cc.loading.overlay)}>
                <div className={cn(cc.loading.spinner, 'w-12 h-12 border-white/20 border-t-white')} />
              </div>
            )}
            <img
              ref={imgRef}
              src={photo.url}
              alt={photo.alt_text}
              onLoad={handleImageLoad}
              onClick={handleImageClick}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              className={cn(
                'max-h-full max-w-full object-contain select-none',
                cc.transition.fast,
                'ease-out',
                isLoading && 'opacity-0',
                !isLoading && 'opacity-100',
                isClosing && 'scale-95 opacity-0',
                isDragging ? 'cursor-grabbing' : (isZoomed ? 'cursor-grab' : 'cursor-zoom-in')
              )}
              style={{
                transform: `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0) scale(${scale})`,
                transformOrigin: '0 0',
                willChange: 'transform',
                touchAction: 'none'
              }}
            />
          </div>

          {/* Info bar */}
          <div
            className={cn(cc.flex.center, 'absolute bottom-6 left-0 right-0 gap-4 text-white px-4')}
            role="region"
            aria-label="Foto informatie"
          >
            {/* Counter */}
            {totalPhotos && currentIndex !== undefined && (
              <div
                className={cn(
                  cc.badge.base,
                  'bg-black/50 backdrop-blur-sm text-white',
                  cc.border.circle
                )}
                aria-label={`Foto ${currentIndex + 1} van ${totalPhotos}`}
              >
                {currentIndex + 1} / {totalPhotos}
              </div>
            )}
            
            {/* Caption */}
            {photo.alt_text && (
              <div
                className={cn(
                  'px-4 py-2 bg-black/50 backdrop-blur-sm text-center max-w-2xl',
                  cc.border.rounded,
                  cc.text.body
                )}
                role="img"
                aria-label={photo.alt_text}
              >
                {photo.alt_text}
              </div>
            )}

            {/* Controls hint - desktop only */}
            <div
              className={cn(
                cc.badge.base,
                'bg-black/50 backdrop-blur-sm text-white hidden md:block',
                cc.border.circle
              )}
              aria-label="Bediening: pijltjestoetsen voor navigatie, spatiebalk voor zoom, escape of klik buiten om te sluiten"
            >
              ← → navigatie | spatie voor zoom | esc om te sluiten
            </div>
          </div>

          {/* Bottom gradient overlay */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-16',
              'bg-gradient-to-t from-black/50 to-transparent'
            )}
            onClick={handleClose}
            aria-hidden="true"
          />
        </div>
      </div>
    </FocusTrap>
  );
});

ImageModal.displayName = 'ImageModal';

export default ImageModal; 