import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import type { Photo } from './types';
import { useSwipe } from '@/hooks/useSwipe';
import { trackEvent } from '@/utils/googleAnalytics';

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

  // Track modal open/close
  useEffect(() => {
    if (isOpen) {
      trackEvent('gallery', 'modal_opened', `photo_${currentIndex}`);
    }
  }, [isOpen, currentIndex]);

  // Swipe handling (blijft grotendeels, maar reset zoom bij navigeren)
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      resetZoomAndPan(); // Reset bij navigeren
      trackEvent('gallery', 'modal_swipe', 'left');
      onNext?.();
    },
    onSwipeRight: () => {
      resetZoomAndPan(); // Reset bij navigeren
      trackEvent('gallery', 'modal_swipe', 'right');
      onPrevious?.();
    },
    onSwipeDown: () => {
      if (!isZoomed) { // Alleen sluiten als niet ingezoomd
          trackEvent('gallery', 'modal_swipe', 'down');
          handleClose();
      }
    },
    onSwipeUp: () => {
        if (!isZoomed) { // Alleen sluiten als niet ingezoomd
            trackEvent('gallery', 'modal_swipe', 'up');
            handleClose();
        }
    },
    threshold: 50,
  });

  // handleClose reset nu ook zoom/pan
  const handleClose = useCallback(() => {
    setIsClosing(true);
    trackEvent('gallery', 'modal_closed', `photo_${currentIndex}`);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      resetZoomAndPan(); // Reset hier
    }, 200);
  }, [onClose, currentIndex, resetZoomAndPan]);

  // Keyboard navigatie (reset zoom bij navigeren)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          trackEvent('gallery', 'modal_keyboard', 'escape');
          handleClose();
          break;
        case 'ArrowLeft':
          resetZoomAndPan(); // Reset bij navigeren
          trackEvent('gallery', 'modal_keyboard', 'left');
          onPrevious?.();
          break;
        case 'ArrowRight':
          resetZoomAndPan(); // Reset bij navigeren
          trackEvent('gallery', 'modal_keyboard', 'right');
          onNext?.();
          break;
        case ' ':
          e.preventDefault();
          // Toggle zoom
          if (isZoomed) {
            resetZoomAndPan();
          } else {
            // Zoom in naar het midden (vereenvoudiging voor spatiebalk)
            setIsZoomed(true);
            setScale(2);
            setDragPosition({ x: 0, y: 0 }); // Zoom naar midden
          }
          trackEvent('gallery', 'modal_zoom', isZoomed ? 'out' : 'in');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, onNext, onPrevious, isZoomed, resetZoomAndPan]);

  // Reset states wanneer foto verandert
  useEffect(() => {
    resetZoomAndPan(); // Gebruik reset functie
    setIsLoading(true);
  }, [photo?.url, resetZoomAndPan]);

  const handleImageLoad = () => {
    setIsLoading(false);
    trackEvent('gallery', 'modal_image_loaded', `photo_${currentIndex}`);
  };

  // Klik om te zoomen op het geklikte punt, of uit te zoomen
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    const imgElement = imgRef.current;
    if (!imgElement) return;

    if (isZoomed) {
      // Uitzoomen
      resetZoomAndPan();
      trackEvent('gallery', 'modal_zoom', 'out');
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
        trackEvent('gallery', 'modal_zoom', 'in_center');
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
      trackEvent('gallery', 'modal_zoom', 'in_point');
    }
  }, [isZoomed, resetZoomAndPan]);

  // Start dragging
  const handleDragStart = (clientX: number, clientY: number) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({
      x: clientX,
      y: clientY,
      initialX: dragPosition.x,
      initialY: dragPosition.y
    });
  };

  // Update drag position
  const handleDragging = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragPosition({
      x: dragStart.initialX + deltaX,
      y: dragStart.initialY + deltaY
    });
  };

  // End dragging
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      trackEvent('gallery', 'modal_pan', `x:${dragPosition.x.toFixed(0)},y:${dragPosition.y.toFixed(0)}`);
    }
  };

  // Mouse events for dragging
  const onMouseDown = (e: React.MouseEvent<HTMLImageElement>) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent<HTMLImageElement>) => handleDragging(e.clientX, e.clientY);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => handleDragEnd(); // Stop ook bij verlaten van img

  // Touch events for dragging
  const onTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 1) { // Alleen pannen bij 1 vinger
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 1) {
      handleDragging(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchEnd = () => handleDragEnd();

  if (!isOpen || !photo) return null;

  return (
    <FocusTrap active={isOpen} focusTrapOptions={{ initialFocus: false }}>
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={photo.alt || `Foto ${currentIndex !== undefined ? currentIndex + 1 : ''}`}
        className={`
          fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm
          transition-all duration-200
          ${isOpen && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
        onClick={handleClose}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Close button overlay - top */}
        <div 
          className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent"
          onClick={handleClose}
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
            onClick={handleClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 group"
            aria-label="Sluit afbeelding"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 transform transition-transform duration-200 group-hover:rotate-90" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {onPrevious && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrevious(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 hover:translate-x-[-4px]"
              aria-label="Vorige foto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {onNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 hover:translate-x-[4px]"
              aria-label="Volgende foto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image container */}
          <div 
            className="flex-1 flex items-center justify-center overflow-hidden"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <img
              ref={imgRef}
              src={photo.url}
              alt={photo.alt}
              onLoad={handleImageLoad}
              onClick={handleImageClick}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              className={`
                max-h-full max-w-full object-contain select-none
                transition-transform duration-200 ease-out 
                ${isLoading ? 'opacity-0' : 'opacity-100'} 
                ${isClosing ? 'scale-95 opacity-0' : ''}
                ${isDragging ? 'cursor-grabbing' : (isZoomed ? 'grab' : 'zoom-in')}
              `}
              style={{ 
                transform: `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0) scale(${scale})`,
                transformOrigin: '0 0',
                willChange: 'transform',
                touchAction: 'none'
              }}
            />
          </div>

          {/* Info bar */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 text-white">
            {/* Counter */}
            {totalPhotos && currentIndex !== undefined && (
              <div className="px-4 py-2 bg-black/50 rounded-full text-sm backdrop-blur-sm">
                {currentIndex + 1} / {totalPhotos}
              </div>
            )}
            
            {/* Caption */}
            {photo.alt && (
              <div className="px-4 py-2 bg-black/50 rounded-lg text-center max-w-2xl backdrop-blur-sm">
                {photo.alt}
              </div>
            )}

            {/* Controls info */}
            <div className="px-4 py-2 bg-black/50 rounded-full text-sm hidden md:block backdrop-blur-sm">
              ← → navigatie | spatie voor zoom | esc of klik buiten om te sluiten
            </div>
          </div>

          {/* Close button overlay - bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"
            onClick={handleClose}
          />
        </div>
      </div>
    </FocusTrap>
  );
});

ImageModal.displayName = 'ImageModal';

export default ImageModal; 