'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { User, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ManagerLoginPage() {
  const [managerName, setManagerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const defaultManagers = [
    "蔡榮哲", "呂軒妤", "吳承洧", "粘心如", "李印強",
    "吳明蒼", "温昱賢", "紀亮宇", "侯炳安", "劉冠甫",
    "張詠霈", "後昌加盟", "林凡淯"
  ]

  const handleLogin = (name: string) => {
    setIsLoading(true)
    // 暫時用 localStorage 儲存登入狀態
    localStorage.setItem('managerLogin', name)
    localStorage.setItem('managerLoginTimestamp', String(Date.now()))

    // 跳轉到房東頁面
    setTimeout(() => {
      window.location.href = '/landlord'
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#C9A962] to-[#A8873A] rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl text-white font-bold">宜</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">物管登入</h1>
          <p className="text-gray-600">選擇您的姓名或輸入</p>
        </div>

        {/* 快速選擇 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-4 text-gray-700">
            <User className="w-5 h-5" />
            <span className="font-medium">快速選擇</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {defaultManagers.map((manager) => (
              <button
                key={manager}
                onClick={() => handleLogin(manager)}
                disabled={isLoading}
                className="px-3 py-2 text-sm bg-gray-50 hover:bg-[#C9A962] hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {manager}
              </button>
            ))}
          </div>
        </div>

        {/* 手動輸入 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            或輸入姓名
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && managerName && handleLogin(managerName)}
              placeholder="請輸入您的姓名"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
              disabled={isLoading}
            />
            <button
              onClick={() => managerName && handleLogin(managerName)}
              disabled={isLoading || !managerName}
              className="px-4 py-2 bg-[#C9A962] text-white rounded-lg hover:bg-[#A8873A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 返回首頁 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-[#C9A962] transition-colors inline-flex items-center gap-2"
          >
            返回首頁
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
