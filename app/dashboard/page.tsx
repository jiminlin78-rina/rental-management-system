"use client"

import { useAuth } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Home, User as UserIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
import { RedirectToSignIn } from "@clerk/nextjs"

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">載入中...</div>
      </div>
    )
  }

  if (!userId) {
    return <RedirectToSignIn />
  }

  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-semibold">宜居</h1>
        <Link href="/sign-in" className="text-sm text-text-muted hover:text-text-secondary">
          登出
        </Link>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="font-heading text-xl font-medium mb-2">
            歡迎回來！
          </h2>
          <p className="text-text-muted text-sm">請選擇您的身份</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/landlord">
            <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold-primary/10 text-gold-primary rounded-xl group-hover:bg-gold-primary group-hover:text-white transition-all">
                  <Home className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-medium mb-1">我是房東</h3>
                  <p className="text-sm text-text-muted">查看物件、對帳單</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/tenant">
            <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent-success/10 text-accent-success rounded-xl group-hover:bg-accent-success group-hover:text-white transition-all">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-medium mb-1">我是房客</h3>
                  <p className="text-sm text-text-muted">查看帳單、繳費記錄</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center pt-8">
          <Link href="/admin" className="text-sm text-text-muted hover:text-text-secondary">
            管理員入口 →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
