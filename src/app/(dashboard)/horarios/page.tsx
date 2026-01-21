import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function HorariosPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Horarios</h1>
        <Link href="/horarios/nuevo">
          <Button>Nuevo Registro</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registros de Horario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Seleccione un rango de fechas para ver los registros de horario.
          </p>
          {/* Aquí iría el componente de filtros y la tabla de horarios */}
        </CardContent>
      </Card>
    </div>
  )
}
