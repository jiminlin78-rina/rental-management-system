"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ReactNode, useMemo } from "react"

export function ConvexProviders({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!convexUrl) {
      throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable")
    }
    return new ConvexReactClient(convexUrl)
  }, [])

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
