import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Surrender App',
  description: 'Policy Surrender Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
