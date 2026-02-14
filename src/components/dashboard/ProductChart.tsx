'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ProductData {
  name: string
  code: string
  quantity: number
}

interface ProductChartProps {
  data: ProductData[]
}

export function ProductChart({ data }: ProductChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No hay datos para mostrar
      </div>
    )
  }

  const chartHeight = Math.max(400, data.length * 40)

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => [value, 'Cantidad']}
          labelFormatter={(label) => {
            const item = data.find((d) => d.name === label)
            return item ? `${item.code} - ${item.name}` : String(label)
          }}
        />
        <Bar dataKey="quantity" fill="#3B82F6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
