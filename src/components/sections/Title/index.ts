/**
 * Title Section
 * Event title and details section
 */

// Note: TitleSection is lazy loaded in Home.tsx, so not exported here to avoid mixed import warnings
export { default as TitleHeader } from './components/TitleHeader';
export { default as EventImage } from './components/EventImage';
export { default as ParticipantCounter } from './components/ParticipantCounter';
export { default as CountdownTimer } from './components/CountdownTimer';
export { default as EventDetailsGrid } from './components/EventDetailsGrid';
export { default as CTAButton } from './components/CTAButton';
export * from './components/EventDetailCard';
// SocialMediaSection is lazy loaded, so not exported statically