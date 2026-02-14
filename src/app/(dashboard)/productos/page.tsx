import { getProducts } from '@/actions/products'
import { ProductsClient } from '@/components/products/ProductsClient'

interface Product {
  id: string
  code: string
  name: string
  description?: string | null
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

  return <ProductsClient products={products} />
}
