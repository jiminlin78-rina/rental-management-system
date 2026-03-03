import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * 獲取 Ragic 數據並同步到 Convex
 * 將中文字段轉換為英文鍵名後調用 mutation
 */
export const syncFromRagicV2 = action({
  args: {
    landlordId: v.id("landlords"),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log('🔄 開始從 Ragic 同步 (V2)...');

    const RAGIC_API_KEY = 'Ulc4dmlGQjJnZEkvZC9hZmYrOTdNN3FEeW90L25FQTd6ZTU2Q1gzOTEycHN1T3djNk5UK3lkNHJiOEtPQmE1RnFTYmNzVWNUUGdUU3V1dFZwZ0kyNVE9PQ==';
    const RAGIC_URL = 'https://ap14.ragic.com/iwow168/property-details/40?api';

    // 獲取 Ragic 數據
    const response = await fetch(RAGIC_URL, {
      headers: {
        'Authorization': `Basic ${RAGIC_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ragic API Error (${response.status})`);
    }

    const data = await response.json();
    let records = Object.values(data);
    console.log(`✅ 獲取到 ${records.length} 筆記錄`);

    // 分頁
    if (args.offset !== undefined) records = records.slice(args.offset);
    if (args.limit !== undefined) records = records.slice(0, args.limit);

    // 轉換中文字段為英文鍵名
    const convertedProperties = records.map((r: any) => {
      // 解析起租日期
      let leaseStartDate: number | undefined;
      if (r['起租']) {
        const parts = String(r['起租']).split('-');
        if (parts.length === 3 && parts.every(p => p)) {
          const date = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
          leaseStartDate = date.getTime();
        }
      }

      // 解析房東租期
      let leaseEndDate: number | undefined;
      if (r['房東租期(迄)']) {
        leaseEndDate = new Date(r['房東租期(迄)']).getTime();
      }

      return {
        ragicRecordId: String(r._ragicId),
        name: String(r['館名'] || '未命名物件'),
        address: String(r['館名'] || ''),
        monthlyRent: parseInt(String(r['租金'] || '0')),
        managementFee: parseInt(String(r['管理費'] || '0')),
        status: String(r['狀態'] || 'unknown'),
        propertyManager: r['物管'] ? String(r['物管']) : undefined,
        deposit: parseInt(String(r['押金'] || '0')),
        leaseStartDate,
        leaseEndDate,
      };
    });

    console.log(`📝 轉換完成，準備同步 ${convertedProperties.length} 筆記錄`);

    // 批量同步
    const result = await ctx.runMutation(api.ragicDirect.syncRagicPropertiesBatch, {
      properties: convertedProperties,
      landlordId: args.landlordId,
    });

    console.log(`✅ 同步完成: 成功 ${result.success}, 失敗 ${result.failed}`);

    return {
      total: convertedProperties.length,
      success: result.success,
      failed: result.failed,
      errors: result.errors.slice(0, 5), // 只返回前 5 個錯誤
    };
  },
});
