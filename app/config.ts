const isDevelopment = process.env.NODE_ENV === 'development'

export const baseUrl = isDevelopment
  ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  : 'https://nrglitch.com'