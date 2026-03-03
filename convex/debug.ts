import { query } from "./_generated/server";

export const listAllProperties = query({
  args: {},
  handler: async (ctx) => {
    const properties = await ctx.db.query("properties").collect();

    // 只返回關鍵欄位，避免 JSON 太大
    return properties.map(p => ({
      id: p._id,
      name: p.name,
      landlordId: p.landlordId?.substring(0, 16) || null,
      propertyManager: p.propertyManager,
      ragicRecordId: p.ragicRecordId,
      monthlyRent: p.monthlyRent,
      status: p.status,
    }));
  },
});
