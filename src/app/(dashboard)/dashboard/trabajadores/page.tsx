import { getWorkers } from '@/actions/workers'
import { DashboardTrabajadoresClient } from '@/components/dashboard'
import { ROLES } from '@/types'

export default async function DashboardTrabajadoresPage() {
  let workers: { id: string; firstName: string; lastName: string }[] = []

  try {
    workers = await getWorkers([ROLES.COSTURERA, ROLES.JORNALERO])
  } catch (error) {
    console.error('Error loading workers:', error)
  }

  return <DashboardTrabajadoresClient workers={workers} />
}
