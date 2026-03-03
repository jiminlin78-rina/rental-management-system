import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * 獲取物管到 landlord 的映射
 */
export const getManagerToLandlordMapping = action({
  args: {},
  handler: async (ctx) => {
    const RAGIC_API_KEY = 'Ulc4dmlGQjJnZEkvZC9hZmYrOTdNN3FEeW90L25FQTd6ZTU2Q1gzOTEycHN1T3djNk5UK3lkNHJiOEtPQmE1RnFTYmNzVWNUUGdUU3V1dFZwZ0kyNVE9PQ==';
    const RAGIC_URL = 'https://ap14.ragic.com/iwow168/property-details/40?api';

    // 獲取 landlords 映射（從之前創建的 action）
    const landlordMapping = await ctx.runAction(api.multiLandlordAction.createManagersAsLandlords);

    console.log('獲取到物管映射:', landlordMapping.mappings);

    return landlordMapping.mappings;
  },
});
