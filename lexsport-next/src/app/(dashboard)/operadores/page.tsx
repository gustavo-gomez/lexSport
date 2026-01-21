import { getWorkers } from '@/actions/workers'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'
import { ROLES, OPERATOR_PERMISSIONS_TEXT } from '@/types'

interface Worker {
  id: string
  firstName: string
  lastName: string
  user: string | null
  permission: string | null
}

export default async function OperadoresPage() {
  let operators: Worker[] = []

  try {
    operators = await getWorkers([ROLES.OPERATOR])
  } catch (error) {
    console.error('Error loading operators:', error)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Operadores</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Operadores</CardTitle>
        </CardHeader>
        <CardContent>
          {operators.length === 0 ? (
            <p className="text-gray-500">
              No hay operadores registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Permisos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map((op) => {
                  const permissions = op.permission?.split(',') || []
                  const permissionLabels = permissions
                    .map((p) => OPERATOR_PERMISSIONS_TEXT[p as keyof typeof OPERATOR_PERMISSIONS_TEXT])
                    .filter(Boolean)
                    .join(', ')

                  return (
                    <TableRow key={op.id}>
                      <TableCell>{op.firstName} {op.lastName}</TableCell>
                      <TableCell>{op.user || '-'}</TableCell>
                      <TableCell>{permissionLabels || '-'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
