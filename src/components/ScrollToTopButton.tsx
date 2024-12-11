import { useState, useEffect } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Controleer scroll positie
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-40 p-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in"
          aria-label="Scroll naar boven"
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 28 }} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton; 