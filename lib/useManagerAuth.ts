import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export interface ManagerAuthState {
  isLoggedIn: boolean
  managerName: string | null
  landlordInfo: {
    landlordId: string
    managerName: string
    landlordName: string
  } | null
  isLoading: boolean
}

export function useManagerLandlord(): ManagerAuthState {
  const { userId: clerkUserId } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [managerName, setManagerName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 檢查 localStorage 的登入狀態
  useEffect(() => {
    const storedName = localStorage.getItem('managerLogin')
    const storedTimestamp = localStorage.getItem('managerLoginTimestamp')

    if (storedName && storedTimestamp) {
      // 檢查是否過期（24 小時）
      const expiration = 24 * 60 * 60 * 1000
      if (Date.now() - parseInt(storedTimestamp) < expiration) {
        setManagerName(storedName)
        setIsLoggedIn(true)
      }
    }
    setIsLoading(false)
  }, [])

  // 根據物管姓名查詢 landlord
  const landlordInfo = useQuery(
    api.landlordLookup.findLandlordByManagerName,
    managerName ? { managerName } : 'skip'
  )

  return {
    isLoggedIn,
    managerName,
    landlordInfo: landlordInfo || null,
    isLoading: isLoading || landlordInfo === undefined,
  }
}

export function logoutManager() {
  localStorage.removeItem('managerLogin')
  localStorage.removeItem('managerLoginTimestamp')
  window.location.href = '/manager-login'
}

export function loginManager(managerName: string) {
  localStorage.setItem('managerLogin', managerName)
  localStorage.setItem('managerLoginTimestamp', String(Date.now()))
  window.location.href = '/landlord'
}
