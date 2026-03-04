import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexProviders } from '@/components/providers'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '宜居 - 包租代管系統',
  description: '專業的包租代管管理平台，房東對帳，房客繳費，一手掌握。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ConvexProviders>
        <html lang="zh-TW" suppressHydrationWarning>
          <body className={cn(
            'min-h-screen bg-primary-bg font-sans antialiased',
            inter.variable
          )}>
            {children}
          </body>
        </html>
      </ConvexProviders>
    </ClerkProvider>
  )
}
