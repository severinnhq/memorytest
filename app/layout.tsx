import './globals.css'
import { Poppins } from 'next/font/google'
import GlobalScript from '@/components/GlobalScript'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Memory Master',
  description: 'Train your memory with engaging tasks',
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
      </body>
    </html>
  )
}