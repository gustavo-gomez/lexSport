import { getProducts } from '@/actions/products'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'

interface Product {
  id: string
  code: string
  name: string
  makingPriceLow: number | string
  makingPriceHigh: number | string
  fillPrice: number | string
}

export default async function ProductosPage() {
  let products: Product[] = []

  try {
    products = await getProducts()
  } catch (error) {
    console.error('Error loading products:', error)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-gray-500">
              No hay productos registrados o la base de datos no está disponible.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio Confección (Bajo)</TableHead>
                  <TableHead>Precio Confección (Alto)</TableHead>
                  <TableHead>Precio Llenado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>S/ {Number(product.makingPriceLow).toFixed(2)}</TableCell>
                    <TableCell>S/ {Number(product.makingPriceHigh).toFixed(2)}</TableCell>
                    <TableCell>S/ {Number(product.fillPrice).toFixed(2)}</TableCell>
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
