import { getWorkers } from '@/actions/workers'
import { OperadoresClient } from '@/components/operadores'
import { ROLES } from '@/types'

interface Operator {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  user: string | null
  permission: string | null
}

export default async function OperadoresPage() {
  let operators: Operator[] = []

  try {
    operators = await getWorkers([ROLES.OPERATOR])
  } catch (error) {
    console.error('Error loading operators:', error)
  }

  return <OperadoresClient operators={operators} />
}
