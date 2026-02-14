import { getWorkers } from '@/actions/workers'
import { ScheduleForm } from '@/components/horarios'
import { ROLES } from '@/types'

export default async function NuevoHorarioPage() {
  let workers: { id: string; firstName: string; lastName: string }[] = []

  try {
    workers = await getWorkers([ROLES.COSTURERA, ROLES.JORNALERO])
  } catch (error) {
    console.error('Error loading workers:', error)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nuevo Registro de Horario</h1>
      </div>
      <ScheduleForm workers={workers} />
    </div>
  )
}
