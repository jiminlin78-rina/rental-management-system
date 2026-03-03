# 宜居包租代管系統 - 專案進度

> 最後更新：2026-02-26

---

## 📋 專案概覽

**專案名稱**：宜居 - 包租代管系統
**位置**：`~/rental-management-system/`
**風格**：日式簡約現代風 (米白 + 金色)

---

## ✅ 已完成項目

### 技術棧設定
- ✅ Next.js 15.1.6 + React 19
- ✅ Tailwind CSS 3.4
- ✅ Framer Motion 11.11
- ✅ Lucide React (Icons)
- ✅ Clerk Auth 已整合
- ✅ Convex Database + Schema 完整定義

### 認證系統
- ✅ Clerk Auth 整合
- ✅ 登入頁面 `/sign-in`
- ✅ 註冊頁面 `/sign-up`
- ✅ Middleware 路由保護
- ✅ 角色選擇頁面 `/dashboard`（房東/房客）

### 房東端 (Mobile First)
| 頁面 | 路徑 | 狀態 |
|------|------|------|
| 房東儀表板 | `/landlord` | ✅ 完成 |
| 物件詳情 | `/landlord/[propertyId]` | ✅ 完成 |
| 新增物件 | `/landlord/new` | ✅ 完成 |
| 帳單管理 | `/landlord/[propertyId]/bills` | ✅ 完成 |
| 房間詳情 | `/landlord/[propertyId]/[roomId]` | ⏳ 待開發 |

**功能：**
- 統計卡片（本月收入、管理物件、整層、分租）
- 物件列表卡片（連結到詳情頁）
- 物件詳情頁（房間按樓層分組、整層分租區分顯示）
- 新增物件表單（物件類型選擇、基本資訊）
- 帳單管理（月份/狀態篩選、批量生成、統計）
- 快捷操作按鈕（帳單管理、新增房間）

### 房客端 (Mobile Only)
| 頁面 | 路徑 | 狀態 |
|------|------|------|
| 房客帳單頁 | `/tenant` | ✅ UI 完成 |

**功能：**
- 本月應繳金額（大卡片）
- 費用明細（租金、管理費、水電網、其他）
- 繳資訊（期限、收款帳號、備註）
- 繳費歷史列表

### Design System
- ✅ 完整色彩系統（米白 #FAF8F5 + 金色 #C9A962）
- ✅ 字體系統（Noto Sans TC + Noto Serif TC + Lato）
- ✅ 間距、圓角、陰影系統
- ✅ 元件類別（card、button、input）
- ✅ 金色漸變文字效果
- ✅ Shimmer 按鈕動畫
- ✅ Tilt 卡片效果（陰影）

### Convex Database Schema & Functions
| 表格 | 用途 | 狀態 |
|------|------|------|
| `users` | 用戶（關聯 Clerk ID）| ✅ 定義完畢 |
| `landlords` | 房東資料 | ✅ 定義完畢 |
| `tenants` | 房客資料 | ✅ 定義完畢 |
| `properties` | 物件 | ✅ 定義完畢 |
| `rooms` | 房間 | ✅ 定義完畢 |
| `bills` | 帳單 | ✅ 定義完畢 |
| `ragicSyncLogs` | Ragic 同步紀錄 | ✅ 定義完畢 |

**Convex API Functions:**
| 功能 | 文件 | 類型 | 狀態 |
|------|------|------|------|
| 房東物件列表 | `properties.ts` | query | ✅ |
| 物件詳情 | `properties.ts` | query | ✅ |
| 房間列表 | `properties.ts` | query | ✅ |
| 新增物件 | `properties.ts` | mutation | ✅ |
| 更新物件 | `properties.ts` | mutation | ✅ |
| 用戶資料 | `users.ts` | query/mutation | ✅ |
| 房客帳單 | `bills.ts` | query | ✅ |
| 物件帳單 | `bills.ts` | query | ✅ |
| 新增帳單 | `bills.ts` | mutation | ✅ |
| 批量生成帳單 | `bills.ts` | mutation | ✅ |
| 標記已繳 | `bills.ts` | mutation | ✅ |
| 測試資料 | `seedData.ts` | mutation | ✅ |
| 清空測試資料 | `seedData.ts` | mutation | ✅ |
| 表格 | 用途 | 狀態 |
|------|------|------|
| `users` | 用戶（關聯 Clerk ID）| ✅ 定義完畢 |
| `landlords` | 房東資料 | ✅ 定義完畢 |
| `tenants` | 房客資料 | ✅ 定義完畢 |
| `properties` | 物件 | ✅ 定義完畢 |
| `rooms` | 房間 | ✅ 定義完畢 |
| `bills` | 帳單 | ✅ 定義完畢 |
| `ragicSyncLogs` | Ragic 同步紀錄 | ✅ 定義完畢 |

---

## 🚧 待辦事項

### 🔴 高優先級

#### 1. 連接 Convex API ✅ 完成
- [x] 安裝 Convex CLI (`npx convex dev`)
- [x] 建立 Convex functions (query/mutation)
- [x] 寫 `properties.ts` - 查詢物件列表
- [x] 寫 `bills.ts` - 查詢房客帳單、批量生成
- [x] 寫 `users.ts` - 用戶角色判斷
- [x] 将模擬資料替換為 Convex API 呼叫

#### 2. 物件詳情頁 ✅ 完成
- [x] 顯示物件資訊卡片
- [x] 按樓層分組顯示房間
- [x] 整層與分租的區別顯示
- [x] 房間明細展示

#### 3. 新增物件功能 ✅ 完成
- [x] 物件類型選擇（分租/整層）
- [x] 基本資訊表單
- [x] API mutation 完成
- [x] 驗證與錯誤處理

#### 4. 帳單管理 ✅ 完成
- [x] 帳單列表頁（`/landlord/[propertyId]/bills`）
- [x] 月份篩選器
- [x] 狀態篩選（待繳/已繳/逾期）
- [x] 批量生成月度帳單 API
- [x] 統計卡片（應收/已收）
- [x] 物件詳情頁入口

#### 5. 測試資料 ✅ 已優化
- [x] 3個物件（左營A棟、鳳山B棟、三民C棟）
- [x] 11個房間（整層+分租）
- [x] 1個測試房客（張小美）
- [x] 3筆測試帳單
- [x] seedData.ts 已完整實現

---

#### 2. API Function 清單
**Query Functions:**
- `listProperties(landlordId)` - 取得房東的物件列表
- `getProperty(propertyId)` - 取得單一物件詳情
- `listRooms(propertyId)` - 取得物件的房間列表
- `getRoom(roomId)` - 取得房間詳情
- `getCurrentBill(tenantId)` - 取得房客本月份帳單
- `getPaymentHistory(tenantId)` - 取得房客繳費歷史
- `getLandlordStats(landlordId)` - 取得房東統計數據
- `getUserByClerkId(clerkId)` - 用 Clerk ID 取得用戶資料

**Mutation Functions:**
- `createProperty(...)` - 新增物件
- `createRoom(...)` - 新增房間
- `generateMonthlyBills(...)` - 產生月度帳單
- `markBillPaid(billId, amount)` - 標記帳單已繳
- `updateBillStatus(billId, status)` - 更新帳單狀態

---

### 🟡 中優先級

#### 3. 房東端 UI 微調
- [ ] 物件卡片 - 加入圖片縮圖
- [ ] 物件詳情頁 - 詳細房間列表
- [ ] 房間詳情頁 - 房租、管理費、水電費設定
- [ ] 帳單列表 - 篩選（全部/待繳/已繳/逾期）
- [ ] 統計頁 - 月度收入圖表

#### 4. 房客端 UI 微調
- [ ] 帳單頁 - 加入即將到期提示 (紅色標示)
- [ ] 繳費記錄 - 分頁載入/無限滾動
- [ ] 加入「通知區域」顯示系統公告

#### 5. 通知系統
- [ ] LINE Messaging API 整合
- [ ] 帳單到期提醒
- [ ] 繳費成功通知
- [ ] 系統公告發送

---

### 🟢 低優先級

#### 6. 管理員端
- [ ] 物件管理頁面（新增/編輯）
- [ ] 房客管理頁面
- [ ] 帳單批量生成
- [ ] Ragic 同步設定

#### 7. 其他
- [ ] 響應式設計優化（Desktop 版）
- [ ] PWA 支援
- [ ] 離線模式

---

## 🔧 開發指令

```bash
# 啟動開發伺服器
cd ~/rental-management-system
npm run dev

# 啟動 Convex 本地開發
npx convex dev

# 部署
npm run build
npm start

# Lint 檢查
npm run lint
```

---

## 📝 備註

- 目前 UI 使用模擬資料，需連接 Convex API
- Design System 基於 `workspace-work/rental-system-design-system.md`
- 角色判斷使用 Clerk 路由保護
- 影像儲存可考慮 Convex Storage 或 Cloudflare R2

---

*Updated by 冬天 (Winter) · 2026-02-24*
