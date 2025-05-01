import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gym Tracker',
  description: 'Track your workouts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="max-w-2xl mx-auto p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}