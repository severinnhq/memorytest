const isDevelopment = process.env.NODE_ENV === 'development'

export const config = {
  baseUrl: isDevelopment ? 'http://localhost:3000' : 'https://nrglitch.com',
}