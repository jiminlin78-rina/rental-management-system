'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function TestPage() {
  const landlord = useQuery(api.users.getFirstLandlord, {})
  const properties = useQuery(
    api.properties.listLandlordProperties,
    landlord?.landlordId ? { landlordId: landlord.landlordId as any } : "skip"
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">測試頁面</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="font-semibold mb-2">房東資訊</h2>
        <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(landlord, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">物件列表（可點擊進入詳情）</h2>
        {properties && properties.map((property) => (
          <a
            key={property._id}
            href={`/landlord/${property._id}`}
            className="block bg-gray-100 p-3 rounded mb-2 hover:bg-gray-200"
          >
            <div className="font-medium">{property.name}</div>
            <div className="text-sm text-gray-600">{property.address}</div>
            <div className="text-xs mt-1">
              ID: {property._id} | {property.roomCount} 間房 | NT${property.totalRent}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
