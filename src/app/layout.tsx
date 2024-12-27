// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cristina Sizemore | Mathematics & Statistics',
  description: 'Mathematics and Statistics Professor at College of Lake County',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Header />
        {children}
      </body>
    </html>
  )
}