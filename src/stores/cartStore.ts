import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '../types'

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem('cart_items')
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem('cart_items', JSON.stringify(items))
  } catch {
    console.warn('Failed to persist cart to localStorage')
  }
}

export const useCartStore = defineStore('cart', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const items = ref<CartItem[]>(loadCartFromStorage())
  const isOpen = ref(false)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => {
      const finalPrice = item.product.price * (1 - item.product.discountPercentage / 100)
      return sum + finalPrice * item.quantity
    }, 0)
  )

  const totalSavings = computed(() =>
    items.value.reduce((sum, item) => {
      const original = item.product.price * item.quantity
      const discounted = item.product.price * (1 - item.product.discountPercentage / 100) * item.quantity
      return sum + (original - discounted)
    }, 0)
  )

  function isInCart(productId: number): boolean {
    return items.value.some((i) => i.product.id === productId)
  }

  function getQuantity(productId: number): number {
    return items.value.find((i) => i.product.id === productId)?.quantity ?? 0
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  function addItem(product: Product): void {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, product.stock)
    } else {
      items.value.push({ product, quantity: 1 })
    }
    saveCartToStorage(items.value)
  }

  function removeItem(productId: number): void {
    items.value = items.value.filter((i) => i.product.id !== productId)
    saveCartToStorage(items.value)
  }

  function updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const item = items.value.find((i) => i.product.id === productId)
    if (item) {
      item.quantity = Math.min(quantity, item.product.stock)
      saveCartToStorage(items.value)
    }
  }

  function clearCart(): void {
    items.value = []
    saveCartToStorage(items.value)
  }

  function toggleCart(): void {
    isOpen.value = !isOpen.value
  }

  return {
    items,
    isOpen,
    totalItems,
    subtotal,
    totalSavings,
    isInCart,
    getQuantity,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
  }
})
