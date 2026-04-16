<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import FilterBar from '../components/FilterBar.vue'
import type { SortOption } from '../types'

const { products, loading, error, fetchProducts, searchProducts } = useProducts()

const searchQuery = ref('')
const sortBy = ref<SortOption>('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  fetchProducts(30, 0)
})

watch(searchQuery, (query) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    if (query.trim()) {
      searchProducts(query.trim())
    } else {
      fetchProducts(30, 0)
    }
  }, 400)
})

function clearSearch(): void {
  searchQuery.value = ''
  fetchProducts(30, 0)
}

const sortedProducts = computed(() => {
  const list = [...products.value]
  switch (sortBy.value) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating)
    case 'discount':
      return list.sort((a, b) => b.discountPercentage - a.discountPercentage)
    case 'name':
      return list.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return list
  }
})

const stats = [
  { icon: '🥩', label: 'Premium Cuts', value: '200+' },
  { icon: '🌿', label: 'Farm Fresh', value: '100%' },
  { icon: '⭐', label: 'Avg Rating', value: '4.8' },
  { icon: '🚚', label: 'Free Delivery', value: '$0' },
]
</script>

<template>
  <main>
    <!-- ── Hero ──────────────────────────────────── -->
    <section class="relative overflow-hidden bg-gradient-to-br from-crimson-900 via-crimson-800 to-stone-900 dark:from-stone-950 dark:via-crimson-950 dark:to-stone-950">
      <!-- Background texture -->
      <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <!-- Hero Text -->
          <div class="animate-slide-up">
            <div class="inline-flex items-center gap-2 bg-crimson-700/40 backdrop-blur-sm border border-crimson-500/30 rounded-full px-4 py-1.5 mb-5">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow"></span>
              <span class="text-crimson-100 text-xs font-semibold tracking-wider uppercase">Premium Butcher & Gourmet Market</span>
            </div>

            <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5">
              The Finest Cuts,<br/>
              <span class="text-amber-300">Delivered Fresh</span>
            </h1>

            <p class="text-crimson-100/80 text-lg mb-8 max-w-md leading-relaxed">
              Farm-to-table premium meats and gourmet groceries, sourced with care from trusted producers.
            </p>

            <div class="flex flex-wrap gap-3">
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <span>🌱</span>
                <span class="text-white text-sm font-medium">Sustainably Sourced</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <span>❄️</span>
                <span class="text-white text-sm font-medium">Cold Chain Delivery</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <span>🏆</span>
                <span class="text-white text-sm font-medium">Award-Winning Quality</span>
              </div>
            </div>
          </div>

          <!-- Hero Stats -->
          <div class="grid grid-cols-2 gap-4 animate-fade-in">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors"
            >
              <div class="text-3xl mb-2">{{ stat.icon }}</div>
              <div class="text-2xl font-black text-white mb-1">{{ stat.value }}</div>
              <div class="text-crimson-200 text-xs font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Main Content ──────────────────────────── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter Bar -->
      <FilterBar
        v-model:search-query="searchQuery"
        v-model:sort-by="sortBy"
        :result-count="sortedProducts.length"
        :is-loading="loading"
        @clear="clearSearch"
      />

      <!-- ── Loading Skeletons ── -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div
          v-for="n in 8"
          :key="n"
          class="card overflow-hidden"
        >
          <div class="skeleton h-48 rounded-t-2xl"></div>
          <div class="p-4 space-y-3">
            <div class="skeleton h-3 rounded-full w-1/4"></div>
            <div class="skeleton h-4 rounded-full w-3/4"></div>
            <div class="skeleton h-3 rounded-full w-full"></div>
            <div class="skeleton h-3 rounded-full w-5/6"></div>
            <div class="flex justify-between items-center pt-1">
              <div class="skeleton h-6 rounded-full w-1/3"></div>
              <div class="skeleton h-5 rounded-full w-1/4"></div>
            </div>
            <div class="skeleton h-9 rounded-xl w-full"></div>
          </div>
        </div>
      </div>

      <!-- ── Error State ── -->
      <div v-else-if="error" class="text-center py-24 animate-fade-in">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="font-display text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
          Failed to Load Products
        </h3>
        <p class="text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto">{{ error }}</p>
        <button @click="fetchProducts(30, 0)" class="btn-primary">
          Try Again
        </button>
      </div>

      <!-- ── Empty State ── -->
      <div v-else-if="sortedProducts.length === 0" class="text-center py-24 animate-fade-in">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="font-display text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
          No products found
        </h3>
        <p class="text-stone-500 dark:text-stone-400 mb-6">
          No results for <strong>"{{ searchQuery }}"</strong>. Try a different search term.
        </p>
        <button @click="clearSearch" class="btn-primary">
          Clear Search
        </button>
      </div>

      <!-- ── Product Grid ── -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <ProductCard
            v-for="product in sortedProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </main>
</template>
