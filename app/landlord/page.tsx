'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, TrendingUp, Users, Calendar, Plus, Search, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatCurrency } from "@/lib/utils"
import { useManagerLandlord, logoutManager } from "@/lib/useManagerAuth"

function LandlordDashboardContent() {
  const { userId, isLoaded } = useAuth()
  const { isLoggedIn: managerLoggedIn, managerName, landlordInfo, isLoading: managerLoading } = useManagerLandlord()
  const [searchQuery, setSearchQuery] = useState("")

  // 檢查是否需要跳轉登入
  useEffect(() => {
    if (!managerLoading && !managerLoggedIn && (!isLoaded || !userId)) {
      window.location.href = '/manager-login'
    }
  }, [managerLoggedIn, managerLoading, isLoaded, userId])

  // 決定使用的 landlordId
  let landlordId = null
  let displayName = "房東"

  if (managerLoggedIn && landlordInfo) {
    // 物管登入
    landlordId = landlordInfo.landlordId
    displayName = managerName || "物管"
  } else if (userId) {
    // Clerk 登入（之後整合用）
    const user = useQuery(api.users.getUserByClerkId, { clerkId: userId })
    landlordId = user?.landlordId || null
    displayName = user?.name || "房東"
  }

  // 查詢房東的物件列表
  const properties = useQuery(
    api.properties.listLandlordProperties,
    landlordId ? { landlordId: landlordId as any } : "skip"
  )

  // 過濾搜尋
  const filteredProperties = properties?.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // 統計資料
  const stats = {
    total: properties?.length || 0,
    totalRent: properties?.reduce((sum, p) => sum + (p.monthlyRent || 0), 0) || 0,
    totalManagementFee: properties?.reduce((sum, p) => sum + (p.managementFee || 0), 0) || 0,
    rented: properties?.filter(p => p.status === '已租').length || 0,
  }

  // 標題
  const title = managerLoggedIn
    ? `${displayName} - 我的物件`
    : "房東中心"

  if (managerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-gray-600">載入中...</div>
      </div>
    )
  }

  if (!landlordId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">未登入，請先登入</p>
          <Link
            href="/manager-login"
            className="bg-[#C9A962] text-white px-6 py-2 rounded-lg hover:bg-[#A8873A]"
          >
            前往登入
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-500">
                {stats.total} 個物件
              </p>
            </div>
          </div>

          {/* 登出按鈕 */}
          {managerLoggedIn && (
            <button
              onClick={logoutManager}
              className="flex items-center gap-2 text-gray-600 hover:text-[#C9A962] transition-colors"
            >
              <span className="hidden sm:inline">登出</span>
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* 統計卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#C9A962] mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">月租總額</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ${formatCurrency(stats.totalRent)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#C9A962] mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">已出租</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stats.rented} / {stats.total}
            </p>
          </div>
        </div>

        {/* 搜尋 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋物件名稱或地址..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
          />
        </div>

        {/* 物件列表 */}
        <div className="space-y-3">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <p>還沒有物件</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/landlord/${property._id}`}>
                    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{property.name}</h3>
                          <p className="text-sm text-gray-500">{property.address}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === '已租'
                            ? 'bg-green-100 text-green-700'
                            : property.status === '再媒合'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {property.status || '未知'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          <span className="font-medium">${formatCurrency(property.monthlyRent || 0)}</span>
                          <span className="text-gray-500"> / 月</span>
                        </span>
                        {property.propertyManager && (
                          <span className="text-gray-500">
                            物管: {property.propertyManager}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}

export default LandlordDashboardContent
