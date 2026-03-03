#!/bin/bash
echo "🔍 開始程式碼品質檢查..."

# 1. 檢查 TypeScript 錯誤
echo "1️⃣ 檢查 TypeScript 錯誤..."
npx tsc --noEmit 2>&1 | head -20

# 2. 檢查未使用的變數
echo "2️⃣ 檢查未使用的 imports..."
npx eslint components/*.tsx --rule 'no-unused-vars: error' 2>&1 | head -20

# 3. 執行測試
echo "3️⃣ 執行測試..."
npx vitest run components/*.test.tsx --reporter=verbose 2>&1 | head -50

echo "✅ 品質檢查完成"
