import { getWorkers } from '@/actions/workers'
import { TrabajadoresClient } from '@/components/trabajadores'
import { ROLES } from '@/types'

interface Worker {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  role: string | null
  oldWorker: number
}

export default async function TrabajadoresPage() {
  let workers: Worker[] = []

  try {
    // Solo obtener costureras y jornaleros (no admin ni operator)
    const allWorkers = await getWorkers([ROLES.COSTURERA, ROLES.JORNALERO])
    workers = allWorkers.map(w => ({
      id: w.id,
      firstName: w.firstName,
      lastName: w.lastName,
      phone: w.phone,
      role: w.role,
      oldWorker: w.oldWorker,
    }))
  } catch (error) {
    console.error('Error loading workers:', error)
  }

  return <TrabajadoresClient workers={workers} />
}
