import { getWorkers } from '@/actions/workers'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'

interface Worker {
  id: string
  firstName: string
  lastName: string
  role: string | null
  phone: string | null
}

export default async function TrabajadoresPage() {
  let workers: Worker[] = []

  try {
    workers = await getWorkers()
  } catch (error) {
    console.error('Error loading workers:', error)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Trabajadores</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Trabajadores</CardTitle>
        </CardHeader>
        <CardContent>
          {workers.length === 0 ? (
            <p className="text-gray-500">
              No hay trabajadores registrados o la base de datos no está disponible.
              <br />
              <span className="text-sm">
                Ejecute: npx prisma generate && npx prisma db push
              </span>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell>{worker.firstName}</TableCell>
                    <TableCell>{worker.lastName}</TableCell>
                    <TableCell className="capitalize">{worker.role}</TableCell>
                    <TableCell>{worker.phone || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
