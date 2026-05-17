import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Net — catch thoughts before they slip away',
  description: 'You open a new tab and your thought evaporates. Net catches it before it disappears.',
  keywords: ['productivity', 'tab management', 'thought capture', 'focus'],
  openGraph: {
    title: 'Net',
    description: 'Cast your net before the thought swims away.',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-ghost-bg text-ghost-text font-mono antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}