/**
 * Event Date Management
 * Centralized date configuration for DKL25 event
 */

/**
 * Event dates configuration
 */
export const EVENT_DATES = {
  main: new Date('2026-05-16T10:00:00+02:00'),
  registration_deadline: new Date('2026-05-15T23:59:59+02:00'),
  early_bird: new Date('2026-03-01T00:00:00+02:00')
} as const

/**
 * Check if the main event has passed
 */
export const isEventPassed = (): boolean => {
  return new Date() > EVENT_DATES.main
}

/**
 * Check if registration is still open
 */
export const isRegistrationOpen = (): boolean => {
  return new Date() < EVENT_DATES.registration_deadline
}

/**
 * Check if early bird period is active
 */
export const isEarlyBirdActive = (): boolean => {
  const now = new Date()
  return now >= EVENT_DATES.early_bird && now < EVENT_DATES.registration_deadline
}

/**
 * Get days until event
 */
export const getDaysUntilEvent = (): number => {
  const now = new Date()
  const diff = EVENT_DATES.main.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Get days until registration deadline
 */
export const getDaysUntilDeadline = (): number => {
  const now = new Date()
  const diff = EVENT_DATES.registration_deadline.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Format event date for display
 */
export const formatEventDate = (date: Date = EVENT_DATES.main): string => {
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Format event time for display
 */
export const formatEventTime = (date: Date = EVENT_DATES.main): string => {
  return new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}