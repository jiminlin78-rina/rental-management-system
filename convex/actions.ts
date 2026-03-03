import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * 獲取 Ragic 數據並同步到 Convex
 * 使用 Action 來避免 CLI 的中文 JSON 解析問題
 */
export const syncFromRagic = action({
  args: {
    landlordId: v.id("landlords"),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log('🔄 開始從 Ragic 同步...');

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
      const text = await response.text();
      throw new Error(`Ragic API Error (${response.status}): ${text}`);
    }

    const data = await response.json();
    let records = Object.values(data);

    console.log(`獲取到 ${records.length} 筆記錄`);

    // 分頁
    if (args.offset !== undefined) {
      records = records.slice(args.offset);
    }
    if (args.limit !== undefined) {
      records = records.slice(0, args.limit);
    }

    // 批量同步（每批 20 筆）
    const batchSize = 20;
    const batches = Math.ceil(records.length / batchSize);
    let success = 0, failed = 0;

    for (let i = 0; i < batches; i++) {
      const batch = records.slice(i * batchSize, (i + 1) * batchSize);

      console.log(`處理批次 ${i + 1}/${batches} (${batch.length} 筆)...`);

      try {
        const result = await ctx.runMutation(api.ragic.syncProperties, {
          ragicRecords: batch.map((r: any) => ({
            _ragicId: String(r._ragicId),
            館名: r['館名'] || '',
            租金: r['租金'] || '0',
            管理費: r['管理費'] || '0',
            狀態: r['狀態'] || '',
            物管: r['物管'] || '',
            簽約日: r['簽約日'] || '',
            押金: r['押金'] || '0',
            起租: `${r['起租(年)'] || ''}-${r['起租(月)'] || ''}-${r['起租(日)'] || ''}`,
            房東租期: r['房東租期(迄)'] || '',
          })),
          landlordId: args.landlordId,
        });

        success += result.success;
        failed += result.failed;

        console.log(`批次 ${i + 1}: 成功 ${result.success}, 失敗 ${result.failed}`);
      } catch (error) {
        console.log(`批次 ${i + 1} 失敗:`, error);
        failed += batch.length;
      }

      // 避免速率限制
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }

    return {
      total: records.length,
      success,
      failed,
    };
  },
});
