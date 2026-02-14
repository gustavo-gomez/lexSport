import { getWorkers } from '@/actions/workers'
import { HorariosClient } from '@/components/horarios'
import { auth } from '@/lib/auth'
import { ROLES } from '@/types'

export default async function HorariosPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === ROLES.ADMIN

  let workers: { id: string; firstName: string; lastName: string }[] = []

  try {
    workers = await getWorkers([ROLES.COSTURERA, ROLES.JORNALERO])
  } catch (error) {
    console.error('Error loading workers:', error)
  }

  return <HorariosClient workers={workers} isAdmin={isAdmin} />
}
