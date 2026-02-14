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

interface WorkerData {
  name: string
  quantity: number
}

interface WorkerChartProps {
  data: WorkerData[]
}

export function WorkerChart({ data }: WorkerChartProps) {
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
        margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fontSize: 12 }}
        />
        <Tooltip formatter={(value) => [value, 'Cantidad']} />
        <Bar dataKey="quantity" fill="#EC4899" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
