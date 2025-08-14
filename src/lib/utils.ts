import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility functions for safe browser API usage
 */

// Safe localStorage access to prevent hydration mismatches
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Check if running on client side
export const isClient = typeof window !== 'undefined'

// Safe window access
export const safeWindow = isClient ? window : null

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Convert to title case
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Nigerian format)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
  return phoneRegex.test(phone)
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Retry function
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await sleep(delay)
      return retry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

// Utility function to merge class names with Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get status color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
    active: "bg-blue-100 text-blue-800",
    inactive: "bg-gray-100 text-gray-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    open: "bg-orange-100 text-orange-800",
    closed: "bg-gray-100 text-gray-800",
    resolved: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    assigned: "bg-purple-100 text-purple-800",
    available: "bg-green-100 text-green-800",
    occupied: "bg-red-100 text-red-800",
    maintenance: "bg-orange-100 text-orange-800",
    reserved: "bg-yellow-100 text-yellow-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
}

// Get priority color
export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  return priorityColors[priority] || "bg-gray-100 text-gray-800";
}

// Get severity color
export function getSeverityColor(severity: string): string {
  const severityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  return severityColors[severity] || "bg-gray-100 text-gray-800";
}

// Generate initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.charAt(0)}${lastName?.charAt(0)}`?.toUpperCase();
}

