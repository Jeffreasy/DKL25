/**
 * Form Validation Utilities
 * Reusable validators for form fields
 */

/**
 * Validate email address
 */
export const emailValidator = (value: string): boolean | string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || 'Ongeldig e-mailadres'
}

/**
 * Validate Dutch phone number
 */
export const phoneValidator = (value: string): boolean | string => {
  // Accepts formats: +31612345678, 0612345678, 06-12345678, 06 12 34 56 78
  const phoneRegex = /^(\+31|0)[6-9]\d{8}$/
  const cleanedValue = value.replace(/[\s-]/g, '')
  return phoneRegex.test(cleanedValue) || 'Ongeldig Nederlands telefoonnummer'
}

/**
 * Validate required field
 */
export const requiredValidator = (value: any): boolean | string => {
  if (typeof value === 'string') {
    return value.trim().length > 0 || 'Dit veld is verplicht'
  }
  return (value !== null && value !== undefined) || 'Dit veld is verplicht'
}

/**
 * Validate minimum length
 */
export const minLengthValidator = (min: number) => {
  return (value: string): boolean | string => {
    return value.length >= min || `Minimaal ${min} karakters vereist`
  }
}

/**
 * Validate maximum length
 */
export const maxLengthValidator = (max: number) => {
  return (value: string): boolean | string => {
    return value.length <= max || `Maximaal ${max} karakters toegestaan`
  }
}

/**
 * Validate URL
 */
export const urlValidator = (value: string): boolean | string => {
  try {
    new URL(value)
    return true
  } catch {
    return 'Ongeldige URL'
  }
}

/**
 * Validate Dutch postal code
 */
export const postalCodeValidator = (value: string): boolean | string => {
  const postalCodeRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/i
  return postalCodeRegex.test(value) || 'Ongeldige postcode (bijv. 1234 AB)'
}

/**
 * Validate age (minimum)
 */
export const minAgeValidator = (minAge: number) => {
  return (birthDate: Date | string): boolean | string => {
    const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
    const today = new Date()
    const age = today.getFullYear() - date.getFullYear()
    const monthDiff = today.getMonth() - date.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= minAge || `Minimale leeftijd is ${minAge} jaar`
    }
    
    return age >= minAge || `Minimale leeftijd is ${minAge} jaar`
  }
}

/**
 * Validate checkbox is checked
 */
export const checkedValidator = (value: boolean): boolean | string => {
  return value === true || 'Dit veld moet aangevinkt zijn'
}

/**
 * Validate number range
 */
export const numberRangeValidator = (min: number, max: number) => {
  return (value: number): boolean | string => {
    if (value < min || value > max) {
      return `Waarde moet tussen ${min} en ${max} liggen`
    }
    return true
  }
}

/**
 * Validate file size
 */
export const fileSizeValidator = (maxSizeMB: number) => {
  return (file: File): boolean | string => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes || `Bestand mag maximaal ${maxSizeMB}MB zijn`
  }
}

/**
 * Validate file type
 */
export const fileTypeValidator = (allowedTypes: string[]) => {
  return (file: File): boolean | string => {
    return allowedTypes.includes(file.type) || 
      `Alleen ${allowedTypes.join(', ')} bestanden zijn toegestaan`
  }
}

/**
 * Compose multiple validators
 */
export const composeValidators = (...validators: Array<(value: any) => boolean | string>) => {
  return (value: any): boolean | string => {
    for (const validator of validators) {
      const result = validator(value)
      if (result !== true) {
        return result
      }
    }
    return true
  }
}