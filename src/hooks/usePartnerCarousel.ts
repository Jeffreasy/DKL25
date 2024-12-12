import { useState, useEffect } from 'react';

export const usePartnerCarousel = (itemsLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && itemsLength > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [itemsLength]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setCurrentIndex(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { currentIndex };
}; 