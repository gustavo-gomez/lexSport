import { auth } from '@/lib/auth'
import { getWorkers } from '@/actions/workers'
import { getProducts } from '@/actions/products'
import { HistorialClient } from '@/components/historial'
import { ROLES } from '@/types'

export default async function HistorialPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === ROLES.ADMIN

  let workers: { id: string; firstName: string; lastName: string; oldWorker: number }[] = []
  let products: { id: string; code: string; name: string; makingPriceLow: number; makingPriceHigh: number; fillPrice: number }[] = []

  try {
    // Obtener solo costureras para el filtro y formulario
    const allWorkers = await getWorkers([ROLES.COSTURERA])
    workers = allWorkers.map(w => ({
      id: w.id,
      firstName: w.firstName,
      lastName: w.lastName,
      oldWorker: w.oldWorker,
    }))

    // Obtener productos
    const allProducts = await getProducts()
    products = allProducts.map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      makingPriceLow: p.makingPriceLow,
      makingPriceHigh: p.makingPriceHigh,
      fillPrice: p.fillPrice,
    }))
  } catch (error) {
    console.error('Error loading data:', error)
  }

  return <HistorialClient workers={workers} products={products} isAdmin={isAdmin} />
}
