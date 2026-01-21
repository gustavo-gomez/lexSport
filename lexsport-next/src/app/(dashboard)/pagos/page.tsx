import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function PagosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pagos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Seleccione un trabajador y rango de fechas para calcular pagos.
          </p>
          {/* Aquí iría el componente de cálculo de pagos */}
        </CardContent>
      </Card>
    </div>
  )
}
