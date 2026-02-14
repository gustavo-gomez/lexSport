import { getWorkers } from '@/actions/workers'
import { PagosClient } from '@/components/pagos'
import { ROLES } from '@/types'

export default async function PagosPage() {
  let workers: { id: string; firstName: string; lastName: string }[] = []

  try {
    // Solo obtener costureras para el filtro
    const allWorkers = await getWorkers([ROLES.COSTURERA])
    workers = allWorkers.map(w => ({
      id: w.id,
      firstName: w.firstName,
      lastName: w.lastName,
    }))
  } catch (error) {
    console.error('Error loading workers:', error)
  }

  return <PagosClient workers={workers} />
}
