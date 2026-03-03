'use client'

import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard")
    }
  }, [userId, isLoaded, router])

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>
  }

  // 如果已登入，不顯示首頁（等跳轉）
  if (userId) return null

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/5 to-gold-light/5" />
        <div className="absolute top-20 right-20 w-64 h-64 border-2 border-gold-primary/10 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-20 w-40 h-40 border border-gold-light/20 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-gold-primary to-gold-light rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-tilt"
          >
            <span className="text-4xl text-white font-heading font-bold">宜</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-heading text-5xl lg:text-6xl font-bold text-primary-text mb-4"
          >
            宜居
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-text-secondary mb-8 font-light"
          >
            專業包租代管系統
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-text-muted mb-12 leading-relaxed"
          >
            房東對帳，房客繳費，<br className="hidden sm:block" />
            一手掌握，簡單優雅。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/sign-in">
              <button className="relative overflow-hidden px-10 py-4 rounded-xl font-medium transition-all duration-250 cursor-pointer bg-gradient-to-r from-gold-primary to-gold-light text-white hover:shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] group">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                <span className="relative z-10 flex items-center gap-2">
                  開始使用
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <footer className="py-6 text-center text-text-muted text-sm border-t border-border-subtle">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-gold-primary" />
          <span>© 2026 宜居. 讓租賃管理更簡單。</span>
        </div>
      </footer>
    </div>
  )
}
