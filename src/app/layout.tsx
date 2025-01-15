// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import RootLayout from '@/components/layout/RootLayout'
import './globals.css'
import 'katex/dist/katex.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cristina Sizemore | Mathematics & Statistics',
  description: 'Mathematics and Statistics Professor at College of Lake County',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider>
          <RootLayout>{children}</RootLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}