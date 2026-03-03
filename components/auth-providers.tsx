"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { ConvexProviders } from "@/components/providers"

export default function AuthProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ConvexProviders>
        {children}
      </ConvexProviders>
    </ClerkProvider>
  )
}
