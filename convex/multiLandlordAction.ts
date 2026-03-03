import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * 獲取所有物管並創建對應的 landlord
 */
export const createManagersAsLandlords = action({
  args: {},
  handler: async (ctx) => {
    console.log('🔄 開始創建物管為 landlord...');

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

    console.log(`獲取到 ${records.length} 筆記錄`);

    // 提取唯一物管
    const uniqueManagers = [...new Set(records.map((r: any) => String(r['物管'])))].filter(Boolean);

    console.log(`發現 ${uniqueManagers.length} 位物管`);

    // 映射物管到 landlord
    const managerToLandlord = new Map<string, string>();

    for (const manager of uniqueManagers) {
      if (!manager || managerToLandlord.has(manager)) {
        continue;
      }

      try {
        // 創建 landlord
        const landlordId = await ctx.runMutation(api.basic.findOrCreateLandlord, {
          managerName: manager,
        });

        managerToLandlord.set(manager, landlordId);
        console.log(`✅ ${manager} -> ${landlordId}`);
      } catch (error) {
        console.log(`❌ ${manager} 創建失敗:`, error);
      }
    }

    // 將中文轉為英文字段
    const mappingArray = Array.from(managerToLandlord.entries()).map(([manager, landlordId]) => ({
      managerName: manager,
      landlordId: landlordId,
    }));

    return {
      totalRecords: records.length,
      uniqueManagers: uniqueManagers.length,
      mappings: mappingArray,
    };
  },
});
