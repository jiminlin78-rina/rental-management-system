import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Ragic → Convex 多房東同步
 * 根據物管字段自動關聯到對應的 landlord
 */
export const syncFromRagicMulti = action({
  args: {},
  handler: async (ctx) => {
    console.log('🔄 開始多房東 Ragic 同步...');

    const RAGIC_API_KEY = 'Ulc4dmlGQjJnZEkvZC9hZmYrOTdNN3FEeW90L25FQTd6ZTU2Q1gzOTEycHN1T3djNk5UK3lkNHJiOEtPQmE1RnFTYmNzVWNUUGdUU3V1dFZwZ0kyNVE9PQ==';
    const RAGIC_URL = 'https://ap14.ragic.com/iwow168/property-details/40?api';

    // 獲取 Ragic 數據
    const response = await fetch(RAGIC_URL, {
      headers: {
        'Authorization': `Basic ${RAGIC_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const records = Object.values(data);

    console.log(`✅ 獲取到 ${records.length} 筆記錄`);

    // 獲取物管到 landlord 的映射
    const mappingResult = await ctx.runAction(api.multiLandlordAction.createManagersAsLandlords);
    const mappingMap = new Map(
      mappingResult.mappings.map((m: any) => [m.managerName, m.landlordId])
    );

    console.log(`✅ 獲取到 ${mappingMap.size} 位物管映射`);

    // 轉換數據並添加 landlord 關聯
    const properties = records.map((r: any) => {
      const manager = r['物管'];
      const landlordId = mappingMap.get(manager);

      if (!landlordId) {
        console.log(`⚠️  物管 ${manager} 無法找到對應 landlord`);
      }

      // 解析起租日期
      let leaseStartDate: number | undefined;
      if (r['起租']) {
        const parts = String(r['起租']).split('-');
        if (parts.length === 3 && parts.every(p => p)) {
          leaseStartDate = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`).getTime();
        }
      }

      // 解析房東租期
      let leaseEndDate: number | undefined;
      if (r['房東租期(迄)']) {
        leaseEndDate = new Date(r['房東租期(迄)']).getTime();
      }

      return {
        managerName: manager,
        landlordId: landlordId, // 可能是 undefined
        property: {
          ragicRecordId: String(r._ragicId),
          name: String(r['館名'] || '未命名物件'),
          address: String(r['館名'] || ''),
          monthlyRent: parseInt(String(r['租金'] || '0')),
          managementFee: parseInt(String(r['管理費'] || '0')),
          status: String(r['狀態'] || 'unknown'),
          propertyManager: manager,
          deposit: parseInt(String(r['押金'] || '0')),
          leaseStartDate,
          leaseEndDate,
        }
      };
    });

    // 按 landlord 分組
    const byLandlord = new Map<string, any[]>();
    for (const item of properties) {
      if (!item.landlordId) continue;

      if (!byLandlord.has(item.landlordId)) {
        byLandlord.set(item.landlordId, []);
      }
      byLandlord.get(item.landlordId)!.push(item.property);
    }

    console.log(`準備為 ${byLandlord.size} 位 landlord 同步物件`);

    let success = 0, failed = 0;

    // 為每個 landlord 批量同步
    for (const [landlordId, props] of byLandlord) {
      console.log(`同步 landlord ${landlordId} 的 ${props.length} 筆物件...`);

      try {
        const result = await ctx.runMutation(api.ragicDirect.syncRagicPropertiesBatch, {
          properties: props,
          landlordId: landlordId as any,
        });

        success += result.success;
        failed += result.failed;

        console.log(`✅ landlord ${landlordId}: 成功 ${result.success}, 失敗 ${result.failed}`);
      } catch (error) {
        console.log(`❌ landlord ${landlordId} 同步失敗:`, error);
        failed += props.length;
      }
    }

    console.log(`✅ 同步完成: 成功 ${success}, 失敗 ${failed}`);

    return {
      total: records.length,
      success,
      failed,
      landlordCount: byLandlord.size,
    };
  },
});
