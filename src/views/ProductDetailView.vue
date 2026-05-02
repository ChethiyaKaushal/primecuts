<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCartStore } from '../stores/cartStore'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const { fetchProductById } = useProducts()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const activeImage = ref('')
const quantity = ref(1)
const addedFeedback = ref(false)

const productId = computed(() => {
  const raw = route.params.id
  return Number(Array.isArray(raw) ? raw[0] : raw)
})

onMounted(async () => {
  if (isNaN(productId.value)) {
    router.replace({ name: 'home' })
    return
  }
  product.value = await fetchProductById(productId.value)
  if (product.value) {
    activeImage.value = product.value.thumbnail
  }
  loading.value = false
})

const finalPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price * (1 - product.value.discountPercentage / 100)
})

const totalForQuantity = computed(() => finalPrice.value * quantity.value)

const ratingStars = computed(() => {
  if (!product.value) return []
  return Array.from({ length: 5 }, (_, i) => i + 1 <= Math.round(product.value!.rating))
})

const stockStatus = computed(() => {
  if (!product.value) return null
  if (product.value.stock === 0) return { text: 'Out of Stock', class: 'text-red-600 dark:text-red-400' }
  if (product.value.stock <= 5) return { text: `Only ${product.value.stock} left!`, class: 'text-amber-600 dark:text-amber-400' }
  return { text: `${product.value.stock} in stock`, class: 'text-emerald-600 dark:text-emerald-400' }
})

function decrementQuantity(): void {
  quantity.value = Math.max(1, quantity.value - 1)
}

function incrementQuantity(): void {
  if (!product.value) return
  quantity.value = Math.min(product.value.stock, quantity.value + 1)
}

function handleAddToCart(): void {
  if (!product.value || product.value.stock === 0) return
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(product.value)
  }
  addedFeedback.value = true
  setTimeout(() => { addedFeedback.value = false }, 2000)
}
const isInstantDelivery = computed(() => {
  if (!product.value) return false

  // 🚚 grocery = instant delivery
  return product.value.category === 'groceries'
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-stone-400 dark:text-stone-500 mb-8">
      <RouterLink to="/" class="hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors">Shop</RouterLink>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      <span v-if="product" class="text-stone-600 dark:text-stone-300 truncate max-w-xs">{{ product.title }}</span>
      <span v-else class="text-stone-600 dark:text-stone-300">Loading...</span>
    </nav>

    <!-- ── Loading ── -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
      <svg class="w-10 h-10 animate-spin text-crimson-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-stone-400 dark:text-stone-500 font-medium">Loading product...</p>
    </div>

    <!-- ── Not Found ── -->
    <div v-else-if="!product" class="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in">
      <div class="text-7xl">🔍</div>
      <h2 class="font-display text-2xl font-bold text-stone-700 dark:text-stone-200">Product Not Found</h2>
      <p class="text-stone-500 dark:text-stone-400">This product doesn't exist or has been removed.</p>
      <RouterLink to="/" class="btn-primary mt-2">Back to Shop</RouterLink>
    </div>

    <!-- ── Product Detail ── -->
    <div v-else class="grid md:grid-cols-2 gap-10 lg:gap-16 animate-fade-in">

      <!-- ── Image Gallery ── -->
      <div>
        <!-- Main Image -->
        <div class="card overflow-hidden mb-3 aspect-square">
          <Transition name="image-fade" mode="out-in">
            <img
              :key="activeImage"
              :src="activeImage"
              :alt="product.title"
              class="w-full h-full object-cover"
            />
          </Transition>
        </div>

        <!-- Thumbnails -->
        <div class="flex gap-2.5 overflow-x-auto pb-1">
          <button
            v-for="(img, idx) in product.images"
            :key="idx"
            @click="activeImage = img"
            :aria-label="`View image ${idx + 1}`"
            :class="[
              'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
              activeImage === img
                ? 'border-crimson-600 shadow-md scale-105'
                : 'border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100 hover:border-stone-400 dark:hover:border-stone-500',
            ]"
          >
            <img :src="img" :alt="`Thumbnail ${idx + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- ── Product Info ── -->
      <div class="flex flex-col">
        <!-- Category & Brand -->
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] uppercase tracking-[0.2em] font-semibold text-crimson-600 dark:text-crimson-400">
            {{ product.category }}
          </span>
          <span class="text-xs text-stone-400 dark:text-stone-500 font-medium">SKU: {{ product.sku }}</span>
        </div>

        <!-- Title -->
        <h1 class="font-display text-3xl md:text-4xl font-black text-stone-900 dark:text-white mb-2 leading-tight">
          {{ product.title }}
        </h1>

        <!-- Brand -->
        <p class="text-stone-400 dark:text-stone-500 text-sm mb-4">by <span class="font-semibold text-stone-600 dark:text-stone-300">{{ product.brand }}</span></p>

        <!-- Rating Row -->
        <div class="flex items-center gap-3 mb-5">
          <div class="flex gap-0.5">
            <svg
              v-for="(filled, idx) in ratingStars"
              :key="idx"
              class="w-4 h-4"
              :class="filled ? 'text-amber-400' : 'text-stone-200 dark:text-stone-700'"
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="text-sm font-semibold text-stone-600 dark:text-stone-300">{{ product.rating.toFixed(1) }}</span>
          <span class="text-sm text-stone-400 dark:text-stone-500">({{ product.reviews.length }} reviews)</span>
        </div>

        <!-- Description -->
        <p class="text-stone-600 dark:text-stone-300 leading-relaxed mb-5 text-sm">
          {{ product.description }}
        </p>

        <!-- Tags -->
        <div v-if="product.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="text-[10px] uppercase tracking-wider font-semibold bg-crimson-50 dark:bg-crimson-950/40 text-crimson-600 dark:text-crimson-400 border border-crimson-200 dark:border-crimson-800 px-3 py-1 rounded-full"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Price Box -->
        <div class="card p-5 mb-6 bg-stone-50 dark:bg-stone-800/50">
          <div class="flex items-end gap-3 mb-3">
            <span class="font-display text-4xl font-black text-crimson-700 dark:text-crimson-400">
              ${{ finalPrice.toFixed(2) }}
            </span>
            <div v-if="product.discountPercentage >= 1" class="flex flex-col items-start pb-1">
              <span class="text-stone-400 dark:text-stone-500 line-through text-sm">${{ product.price.toFixed(2) }}</span>
              <span class="bg-amber-400 text-stone-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                SAVE {{ Math.round(product.discountPercentage) }}%
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="text-stone-400 dark:text-stone-500">Stock:</span>
              <span :class="stockStatus?.class" class="font-semibold">{{ stockStatus?.text }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-stone-400 dark:text-stone-500">Ships:</span>
              <span
                    :class="isInstantDelivery ? 'text-emerald-600 font-bold' : 'text-stone-600'"
>                    {{ isInstantDelivery ? '🚚 Instant Delivery (Within 2–3 hrs)' : product.shippingInformation }}
</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-stone-400 dark:text-stone-500">Warranty:</span>
              <span class="font-semibold text-stone-600 dark:text-stone-300">{{ product.warrantyInformation }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-stone-400 dark:text-stone-500">Returns:</span>
              <span class="font-semibold text-stone-600 dark:text-stone-300">{{ product.returnPolicy }}</span>
            </div>
          </div>
        </div>

        <!-- Quantity & Add to Cart -->
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center card overflow-hidden">
            <button
              @click="decrementQuantity"
              :disabled="quantity <= 1"
              class="px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-lg transition-colors disabled:opacity-40"
            >−</button>
            <span class="px-4 py-3 font-bold text-stone-800 dark:text-stone-100 min-w-[3.5rem] text-center tabular-nums">
              {{ quantity }}
            </span>
            <button
              @click="incrementQuantity"
              :disabled="product.stock === 0 || quantity >= product.stock"
              class="px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-lg transition-colors disabled:opacity-40"
            >+</button>
          </div>

          <button
            @click="handleAddToCart"
            :disabled="product.stock === 0"
            :class="[
              'flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95',
              addedFeedback
                ? 'bg-emerald-600 text-white'
                : product.stock === 0
                  ? 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
                  : 'bg-crimson-700 hover:bg-crimson-800 text-white shadow-md hover:shadow-lg',
            ]"
          >
            <Transition name="text-fade" mode="out-in">
              <span :key="addedFeedback ? 'added' : 'add'">
                {{ addedFeedback ? `✓ Added ${quantity > 1 ? `(×${quantity})` : ''}` : product.stock === 0 ? 'Out of Stock' : `Add ${quantity > 1 ? `${quantity}× ` : ''}to Cart — $${totalForQuantity.toFixed(2)}` }}
              </span>
            </Transition>
          </button>
        </div>

        <!-- View Cart CTA -->
        <Transition name="fade">
          <RouterLink
            v-if="cartStore.isInCart(product.id)"
            to="/cart"
            class="text-center text-sm text-crimson-600 dark:text-crimson-400 hover:underline font-medium mb-4 block"
          >
            View Cart ({{ cartStore.totalItems }} items) →
          </RouterLink>
        </Transition>
      </div>
    </div>

    <!-- ── Reviews ── -->
    <div v-if="product && product.reviews.length > 0" class="mt-14">
      <h2 class="font-display text-2xl font-black text-stone-800 dark:text-stone-100 mb-6">
        Customer Reviews
      </h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(review, idx) in product.reviews"
          :key="idx"
          class="card p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-stone-800 dark:text-stone-100 text-sm">{{ review.reviewerName }}</p>
              <p class="text-xs text-stone-400 dark:text-stone-500">{{ new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</p>
            </div>
            <div class="flex gap-0.5">
              <span
                v-for="i in 5"
                :key="i"
                :class="i <= review.rating ? 'text-amber-400' : 'text-stone-200 dark:text-stone-700'"
                class="text-sm"
              >★</span>
            </div>
          </div>
          <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.2s ease;
}
.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}

.text-fade-enter-active,
.text-fade-leave-active {
  transition: opacity 0.15s ease;
}
.text-fade-enter-from,
.text-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
