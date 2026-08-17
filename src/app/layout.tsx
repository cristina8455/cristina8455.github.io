// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import RootLayout from '@/components/layout/RootLayout'
import SyncStamp from '@/components/layout/SyncStamp'
import './globals.css'
import 'katex/dist/katex.min.css'

/* Inter for interface, labels and dense course data — it is a good UI face and
 * a tired display one. Source Serif 4 carries the headings and anything read
 * at length: it was designed for screen reading, it belongs in an academic
 * setting, and it is not one of the two or three faces every template uses. */
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
})

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
      <body className={`${sans.variable} ${serif.variable} font-sans min-h-screen bg-background`}>
        <ThemeProvider>
          <RootLayout footer={<SyncStamp />}>{children}</RootLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}