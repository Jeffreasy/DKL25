/**
 * Countdown Calculator
 * Utilities for calculating time remaining until events
 */

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

/**
 * Calculate countdown to a target date
 * Returns null if the target date has passed
 */
export const calculateCountdown = (targetDate: Date): CountdownTime | null => {
  const now = Date.now()
  const target = targetDate.getTime()
  const diff = target - now

  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    total: diff
  }
}

/**
 * Format countdown for display
 */
export const formatCountdown = (countdown: CountdownTime | null): string => {
  if (!countdown) return 'Evenement is geweest'

  const parts: string[] = []

  if (countdown.days > 0) {
    parts.push(`${countdown.days} dag${countdown.days !== 1 ? 'en' : ''}`)
  }
  if (countdown.hours > 0) {
    parts.push(`${countdown.hours} uur`)
  }
  if (countdown.minutes > 0 && countdown.days === 0) {
    parts.push(`${countdown.minutes} minuten`)
  }
  if (countdown.seconds > 0 && countdown.days === 0 && countdown.hours === 0) {
    parts.push(`${countdown.seconds} seconden`)
  }

  return parts.join(', ') || 'Nu!'
}

/**
 * Format countdown as compact string (e.g., "5d 3h 20m")
 */
export const formatCountdownCompact = (countdown: CountdownTime | null): string => {
  if (!countdown) return '--'

  const parts: string[] = []

  if (countdown.days > 0) parts.push(`${countdown.days}d`)
  if (countdown.hours > 0) parts.push(`${countdown.hours}u`)
  if (countdown.minutes > 0 && countdown.days === 0) parts.push(`${countdown.minutes}m`)
  if (countdown.seconds > 0 && countdown.days === 0 && countdown.hours === 0) {
    parts.push(`${countdown.seconds}s`)
  }

  return parts.join(' ') || 'Nu!'
}

/**
 * Get percentage of time elapsed
 */
export const getTimeElapsedPercentage = (
  startDate: Date,
  endDate: Date
): number => {
  const now = Date.now()
  const start = startDate.getTime()
  const end = endDate.getTime()

  if (now <= start) return 0
  if (now >= end) return 100

  const total = end - start
  const elapsed = now - start

  return Math.round((elapsed / total) * 100)
}