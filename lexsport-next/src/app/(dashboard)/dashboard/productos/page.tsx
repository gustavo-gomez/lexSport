import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function DashboardProductosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard - Productos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Producción por Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Seleccione un rango de fechas para ver las estadísticas de producción.
          </p>
          {/* Aquí iría el gráfico de producción */}
        </CardContent>
      </Card>
    </div>
  )
}
