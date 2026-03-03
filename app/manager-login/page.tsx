import { useState } from "react"
import { motion } from "framer-motion"
import { User, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ManagerLoginPage() {
  const [managerName, setManagerName] = useState("")
  const [isLoading, setIsLoading] =useState(false)
  const [error, setError] = useState("")

  // 預設的物管列表（從之前的分析結果）
  const defaultManagers = [
    "蔡榮哲", "呂軒妤", "吳承洧", "粘心如", "李印強",
    "吳明蒼", "温昱賢", "紀亮宇", "侯炳安", "劉冠甫",
    "張詠霈", "後昌加盟", "林凡淯"
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!managerName.trim()) {
      setError("請輸入物管姓名")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // 模擬登入 - 之後會替換成真實 API 呼叫
      // 暫時用 localStorage 儲存登入狀態
      localStorage.setItem('managerLogin', 'true')
      localStorage.setItem('managerName', managerName)

      // 跳轉到 dashboard
      window.location.href = '/landlord'

    } catch (err) {
      setError("登入失敗，請確認姓名")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo / 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#C9A962] mb-2">
            宜居包租
          </h1>
          <p className="text-gray-600">物管登入系統</p>
        </div>

        {/* 登入表單 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleLogin}>
            {/* 姓名輸入 */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                物管姓名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="請輸入姓名，例如：吳明蒼"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* 下拉提示 */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">已有物管：</p>
              <div className="flex flex-wrap gap-2">
                {defaultManagers.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setManagerName(name)}
                    className="px-3 py-1 text-sm bg-[#FAF8F5] text-[#C9A962] rounded-full
                             hover:bg-[#C9A962] hover:text-white transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* 登入按鈕 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C9A962] text-white py-3 rounded-lg font-medium
                       hover:bg-[#A8873A] transition-colors flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">登入中...</span>
              ) : (
                <>
                  <span>登入</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 返回 */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-[#C9A962] hover:underline text-sm"
          >
            返回首頁
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
