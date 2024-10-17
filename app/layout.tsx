import './globals.css'
import { Montserrat } from 'next/font/google'
import GlobalScript from '@/components/GlobalScript'
import { Analytics } from "@vercel/analytics/react"



const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // You can adjust weights as needed
  variable: '--font-montserrat',
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
<body className={`${montserrat.variable} font-sans`}>
        {children}
        <GlobalScript />
        <Analytics />
      </body>
    </html>
  )
}