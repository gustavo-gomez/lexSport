'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Input,
  Modal,
} from '@/components/ui'
import { ProductForm } from './ProductForm'
import { deleteProduct } from '@/actions/products'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  code: string
  name: string
  description?: string | null
  makingPriceLow: number | string
  makingPriceHigh: number | string
  fillPrice: number | string
}

interface ProductsClientProps {
  products: Product[]
}

export function ProductsClient({ products }: ProductsClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const searchLower = search.toLowerCase()
    return products.filter(
      ({ name, code }) =>
        name.toLowerCase().includes(searchLower) ||
        code.toLowerCase().includes(searchLower)
    )
  }, [products, search])

  const handleEdit = (product: Product) => {
    setProductToEdit(product)
    setShowForm(true)
  }

  const handleNew = () => {
    setProductToEdit(null)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setProductToEdit(null)
    router.refresh()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setProductToEdit(null)
  }

  const handleDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await deleteProduct(productToDelete.id)
      setProductToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <Button onClick={handleNew}>+ Nuevo Producto</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por nombre o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">
              {search ? 'No se encontraron productos con ese criterio.' : 'No hay productos registrados.'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>P. Confección (Alto)</TableHead>
                  <TableHead>P. Confección (Bajo)</TableHead>
                  <TableHead>P. Llenado</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>S/ {Number(product.makingPriceHigh).toFixed(2)}</TableCell>
                    <TableCell>S/ {Number(product.makingPriceLow).toFixed(2)}</TableCell>
                    <TableCell>S/ {Number(product.fillPrice).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Formulario */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <ProductForm
          product={productToEdit}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Confirmar eliminación"
      >
        <p className="mb-6 text-gray-600">
          ¿Está seguro que desea eliminar el producto <strong>{productToDelete?.name}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setProductToDelete(null)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
