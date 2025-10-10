/**
 * Components Index
 * Central export point for all components
 */

// Common components
export * from './common';

// Layout components
export * from './layout';

// Section components
export * from './sections';

// UI components
export * from './ui';

// Legacy exports for backward compatibility
export { default as Navbar } from './layout/Navbar/Navbar';
export { default as PartnerCarrousel } from '../features/partners/components/PartnerCarousel';
export { default as PhotoGallery } from '../features/gallery/components';
export { DKLSponsors } from '../features/sponsors/components';
export { Footer } from './layout/Footer';
export { RadioGallery } from './sections/Radio';