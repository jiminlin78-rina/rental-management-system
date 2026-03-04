import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import { Noto_Serif_TC } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexProviders } from '@/components/providers'
import { cn } from '@/lib/utils'
import './globals.css'

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

const notoSerif = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

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
        <html lang="zh-TW" suppressHydrationWarning className={`${notoSans.variable} ${notoSerif.variable}`}>
          <body className={cn(
            'min-h-screen bg-primary-bg font-body antialiased'
          )}>
            {children}
          </body>
        </html>
      </ConvexProviders>
    </ClerkProvider>
  )
}
