// Lazy load RadioGallery for better performance
import { lazy } from 'react';

const RadioGallery = lazy(() => import('./RadioGallery'));
const RadioPlayer = lazy(() => import('./RadioPlayer'));

// Export lazy-loaded components
export { RadioGallery, RadioPlayer };

// Export individual components as named exports for backward compatibility
export { default as RadioGallerySync } from './RadioGallery';
export { default as RadioPlayerSync } from './RadioPlayer';