import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 優化字體載入
  optimizeFonts: true,
  
  // 確保字體正確載入
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // 輸出追蹤根目錄
  outputFileTracingRoot: '/Users/user/rental-management-system',
}

export default nextConfig
