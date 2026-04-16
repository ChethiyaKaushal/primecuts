import { ref } from 'vue'
import type { Product, ProductsResponse } from '../types'

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  async function fetchProducts(limit = 30, skip = 0): Promise<void> {
    loading.value = true
    error.value = null
    try {
      // Fetch from multiple categories to get a good variety of food/grocery items
      const response = await fetch(
        `https://dummyjson.com/products/category/groceries?limit=${limit}&skip=${skip}`
      )
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const data = await response.json() as ProductsResponse
      products.value = data.products
      total.value = data.total
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`)
      if (!response.ok) throw new Error(`Product not found`)
      return await response.json() as Product
    } catch {
      return null
    }
  }

  async function searchProducts(query: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=50`
      )
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const data = await response.json() as ProductsResponse
      products.value = data.products
      total.value = data.total
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Search failed'
    } finally {
      loading.value = false
    }
  }

  async function fetchByCategory(category: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(
        `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=50`
      )
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const data = await response.json() as ProductsResponse
      products.value = data.products
      total.value = data.total
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load category'
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    total,
    fetchProducts,
    fetchProductById,
    searchProducts,
    fetchByCategory,
  }
}
