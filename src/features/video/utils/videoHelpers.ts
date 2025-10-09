/**
 * Video Helper Utilities
 * Functions for video URL validation and thumbnail generation
 */

/**
 * Validate and format video URL
 */
export const validateVideoUrl = (url: string, videoId: string): string => {
  try {
    // Als het een Streamable URL is, zorg voor het juiste embed formaat
    if (url.includes('streamable.com')) {
      // Verwijder mogelijke '/e/' uit de URL en voeg het juiste pad toe
      const cleanVideoId = videoId.replace('e/', '')
      return `https://streamable.com/e/${cleanVideoId}`
    }
    
    // Voor andere URLs, valideer en return
    const validUrl = new URL(url)
    return validUrl.toString()
  } catch (e) {
    console.error('Invalid video URL:', url, e)
    return ''
  }
}

/**
 * Generate thumbnail URL for Streamable videos
 */
export const generateThumbnailUrl = (videoId: string): string => {
  // Verwijder mogelijke 'e/' uit de video ID voor de thumbnail URL
  const cleanVideoId = videoId.replace('e/', '')
  return `https://cdn-cf-east.streamable.com/image/${cleanVideoId.trim()}.jpg`
}

/**
 * Check if video URL is valid
 */
export const isValidVideoUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Extract video ID from URL
 */
export const extractVideoId = (url: string): string | null => {
  try {
    if (url.includes('streamable.com')) {
      const match = url.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/)
      return match ? match[1] : null
    }
    return null
  } catch {
    return null
  }
}