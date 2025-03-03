import { useState, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

interface SwipeResult {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: SwipeHandlers): SwipeResult => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const xDistance = touchStart.x - touchEnd.x;
    const yDistance = touchStart.y - touchEnd.y;
    
    // Bepaal of de swipe meer horizontaal of verticaal is
    const isHorizontal = Math.abs(xDistance) > Math.abs(yDistance);

    if (isHorizontal) {
      const isLeftSwipe = xDistance > threshold;
      const isRightSwipe = xDistance < -threshold;

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      }

      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      const isUpSwipe = yDistance > threshold;
      const isDownSwipe = yDistance < -threshold;

      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      }

      if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}; 