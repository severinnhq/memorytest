import './globals.css'
import { Poppins } from 'next/font/google'
import GlobalScript from '@/components/GlobalScript'
import { Analytics } from "@vercel/analytics/react"

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Nrglitch',
  description: 'Train the weekest part of your memory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        {children}
        <GlobalScript />
        <Analytics />
      </body>
    </html>
  )
}