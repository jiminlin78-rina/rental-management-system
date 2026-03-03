# 宜居包租代管系統

專業包租代管系統，支援多房東管理、物件管理、帳單管理等功能。

## 技術棧

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion 11.11
- **Database**: Convex (即時資料庫)
- **Auth**: Clerk (身份驗證)
- **Design**: 日式簡約風 (米白 #FAF8F5 + 金色 #C9A962)

## 功能特色

### 多房東架構
- ✅ 支援多房東獨立管理
- ✅ 每個房東只能查看自己的物件
- ✅ 物管登入驗證自動匹配 landlord

### 物件管理
- ✅ Ragic 同步整合（363 筆物件）
- ✅ 物件狀態追蹤（已租/再媒合/空置）
- ✅ 月租和管理費記錄
- ✅ 13 位物管分配（64/48/41 筆物件）

### 身份驗證
- ✅ Clerk Auth 整合
- ✅ 物管簡化登入（方案 A 完成）
- ✅ 未來規劃：Clerk 姓名自動匹配（方案 C）

## 快速開始

### 安裝依賴

```bash
npm install
```

### 設置環境變數

```bash
cp .env.local.example .env.local
```

編輯 `.env.local` 並填入：
- Convex 部署資訊
- Clerk API keys

### 本地開發

```bash
# 啟動 Convex
npx convex dev

# 啟動 Next.js
npm run dev
```

訪問 http://localhost:3000

## 部署

### Vercel（推薦）

1. 推送到 GitHub
2. 在 Vercel New Project 選擇此倉庫
3. 設置環境變數
4. Deploy

### Ragic 同步

```bash
# 同步 Ragic 數據到 Convex
cd ~/rental-management-system
npx convex run multiLandlordSync:syncFromRagicMulti
```

## 專案結構

```
rental-management-system/
├── app/                 # Next.js App Router
│   ├── landlord/        # 房東頁面
│   ├── manager-login/   # 物管登入
│   └── tenant/          # 房客頁面
├── convex/              # Convex 資料庫
│   ├── _generated/      # 自動生成
│   ├── schema.ts        # 資料庫設計
│   └── properties.ts    # 物件查詢
├── lib/                 # 工具函數
│   ├── managerAuth.ts   # 物管驗證
│   └── useManagerAuth.ts # React Hook
└── scripts/             # Ragic 同步腳本
```

## 數據統計

| 項目 | 數量 |
|-----|------|
| 房東數 | 13 位 |
| 物件數 | 363 筆 |
| Ragic 同步 | 100% 成功 |

## 許可證

© 2026 宜居
