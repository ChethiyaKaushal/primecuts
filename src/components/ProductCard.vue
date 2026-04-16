<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '../types'
import { useCartStore } from '../stores/cartStore'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cartStore = useCartStore()

const finalPrice = computed(() =>
  props.product.price * (1 - props.product.discountPercentage / 100)
)

const stockStatus = computed(() => {
  if (props.product.stock === 0) return { label: 'Out of Stock', class: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' }
  if (props.product.stock <= 5) return { label: `Only ${props.product.stock} left`, class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' }
  return { label: 'In Stock', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' }
})

const inCart = computed(() => cartStore.isInCart(props.product.id))

function handleAddToCart(e: MouseEvent): void {
  e.stopPropagation()
  cartStore.addItem(props.product)
}

function navigateToDetail(): void {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}
</script>

<template>
  <article
    class="group card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer animate-fade-in"
    @click="navigateToDetail"
    :aria-label="`View details for ${product.title}`"
  >
    <!-- ── Image ────────────────────────────────── -->
    <div class="relative overflow-hidden h-48 bg-stone-100 dark:bg-stone-800">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
        decoding="async"
      />

      <!-- Discount Badge -->
      <div
        v-if="product.discountPercentage >= 1"
        class="absolute top-3 left-3 bg-crimson-700 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md"
      >
        −{{ Math.round(product.discountPercentage) }}%
      </div>

      <!-- Rating Badge -->
      <div class="absolute top-3 right-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md">
        <span class="text-amber-400 text-xs">★</span>
        <span class="text-xs font-semibold text-stone-700 dark:text-stone-200">{{ product.rating.toFixed(1) }}</span>
      </div>

      <!-- Quick Add Overlay -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors duration-300" />
    </div>

    <!-- ── Body ─────────────────────────────────── -->
    <div class="p-4">
      <!-- Category -->
      <p class="text-[10px] uppercase tracking-[0.15em] font-semibold text-crimson-600 dark:text-crimson-400 mb-1">
        {{ product.category }}
      </p>

      <!-- Title -->
      <h3 class="font-display text-sm font-bold text-stone-800 dark:text-stone-100 line-clamp-2 mb-1 group-hover:text-crimson-700 dark:group-hover:text-crimson-400 transition-colors leading-snug">
        {{ product.title }}
      </h3>

      <!-- Description -->
      <p class="text-xs text-stone-400 dark:text-stone-500 line-clamp-2 mb-3 leading-relaxed">
        {{ product.description }}
      </p>

      <!-- Price Row -->
      <div class="flex items-end justify-between mb-3">
        <div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-lg font-black text-crimson-700 dark:text-crimson-400">
              ${{ finalPrice.toFixed(2) }}
            </span>
            <span
              v-if="product.discountPercentage >= 1"
              class="text-xs text-stone-400 dark:text-stone-500 line-through"
            >
              ${{ product.price.toFixed(2) }}
            </span>
          </div>
        </div>
        <span :class="['text-[10px] font-semibold px-2 py-1 rounded-full', stockStatus.class]">
          {{ stockStatus.label }}
        </span>
      </div>

      <!-- CTA -->
      <button
        @click="handleAddToCart"
        :disabled="product.stock === 0"
        :class="[
          'w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95',
          inCart
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-crimson-700 hover:bg-crimson-800 text-white',
          product.stock === 0 ? 'opacity-40 cursor-not-allowed' : '',
        ]"
      >
        <span v-if="inCart">✓ In Cart ({{ cartStore.getQuantity(product.id) }})</span>
        <span v-else-if="product.stock === 0">Out of Stock</span>
        <span v-else>Add to Cart</span>
      </button>
    </div>
  </article>
</template>
