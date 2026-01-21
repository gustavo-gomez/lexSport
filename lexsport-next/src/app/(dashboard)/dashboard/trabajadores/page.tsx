import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function DashboardTrabajadoresPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard - Trabajadores</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Producción por Trabajador</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Seleccione un trabajador y rango de fechas para ver sus estadísticas.
          </p>
          {/* Aquí iría el gráfico de producción del trabajador */}
        </CardContent>
      </Card>
    </div>
  )
}
