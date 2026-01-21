import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import { PERU_TIME_OFFSET, MILLISECONDS_IN_ONE_DAY } from '@/types'

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'keylexsportsystem'

/**
 * Hash password using the same algorithm as the legacy system
 * to maintain compatibility with existing user passwords
 */
export function hashPassword(password: string): string {
  return Base64.stringify(hmacSHA512(sha256(password), PRIVATE_KEY))
}

/**
 * Verify if a password matches the stored hash
 */
export function verifyPassword(storedHash: string, attemptedPassword: string): boolean {
  return storedHash === hashPassword(attemptedPassword)
}

/**
 * Get start of day in Peru timezone (UTC-5) as milliseconds
 */
export function getStartDateMillis(date: Date): number {
  const peruDate = new Date(date.getTime() + PERU_TIME_OFFSET * 60 * 60 * 1000)
  peruDate.setUTCHours(0, 0, 0, 0)
  return peruDate.getTime()
}

/**
 * Get end of day in Peru timezone (UTC-5) as milliseconds
 */
export function getEndDateMillis(date: Date): number {
  return getStartDateMillis(date) + MILLISECONDS_IN_ONE_DAY
}

/**
 * Format date for display in Peru timezone
 */
export function formatDatePeru(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Format time for display in Peru timezone
 */
export function formatTimePeru(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/**
 * Utility to merge class names (similar to clsx/cn)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
