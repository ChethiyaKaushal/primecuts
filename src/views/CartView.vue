<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const SHIPPING_THRESHOLD = 50
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">

    <!-- ── Header ── -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-3xl font-black text-stone-900 dark:text-white">
        Your Cart
        <span v-if="cartStore.totalItems > 0" class="text-crimson-600 dark:text-crimson-400">
          ({{ cartStore.totalItems }})
        </span>
      </h1>
      <RouterLink
        to="/"
        class="text-sm text-stone-500 dark:text-stone-400 hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Continue Shopping
      </RouterLink>
    </div>

    <!-- ── Empty Cart ── -->
    <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-32 gap-5 animate-fade-in">
      <div class="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-5xl">
        🛒
      </div>
      <h2 class="font-display text-2xl font-bold text-stone-700 dark:text-stone-200">Your Cart is empty</h2>
      <p class="text-stone-500 dark:text-stone-400 text-center max-w-xs">
        Looks like you haven't added any products yet. Start exploring our premium selection!
      </p>
      <RouterLink to="/" class="btn-primary mt-2">
        Browse Products
      </RouterLink>
    </div>

    <!-- ── Cart Content ── -->
    <div v-else class="grid lg:grid-cols-3 gap-8 animate-fade-in">

      <!-- ── Items List ── -->
      <div class="lg:col-span-2 space-y-3">

        <!-- Free shipping progress -->
        <div class="card p-4 mb-2">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="font-medium text-stone-700 dark:text-stone-200">
              <template v-if="cartStore.subtotal >= SHIPPING_THRESHOLD">
                🎉 You qualify for <strong>FREE delivery!</strong>
              </template>
              <template v-else>
                Add
                <strong class="text-crimson-600 dark:text-crimson-400">
                  ${{ (SHIPPING_THRESHOLD - cartStore.subtotal).toFixed(2) }}
                </strong>
                more for free delivery
              </template>
            </span>
            <span class="text-stone-400 text-xs">${{ SHIPPING_THRESHOLD.toFixed(0) }} threshold</span>
          </div>
          <div class="h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-crimson-600 to-amber-400 rounded-full transition-all duration-500"
              :style="{ width: `${Math.min((cartStore.subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` }"
            />
          </div>
        </div>

        <!-- Cart Items -->
        <TransitionGroup name="cart-item" tag="div" class="space-y-3">
          <div
            v-for="item in cartStore.items"
            :key="item.product.id"
            class="card p-4 flex gap-4 hover:shadow-md transition-shadow"
          >
            <!-- Thumbnail -->
            <RouterLink
              :to="`/product/${item.product.id}`"
              class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img
                :src="item.product.thumbnail"
                :alt="item.product.title"
                class="w-full h-full object-cover"
              />
            </RouterLink>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-[10px] uppercase tracking-wider text-crimson-500 dark:text-crimson-400 font-semibold mb-0.5">
                {{ item.product.category }}
              </p>
              <RouterLink
                :to="`/product/${item.product.id}`"
                class="font-semibold text-stone-800 dark:text-stone-100 text-sm leading-snug hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors line-clamp-2 block"
              >
                {{ item.product.title }}
              </RouterLink>
              <p class="text-xs text-stone-400 dark:text-stone-500 mt-0.5">by {{ item.product.brand }}</p>

              <!-- Mobile Price -->
              <p class="font-black text-crimson-700 dark:text-crimson-400 text-sm mt-1 md:hidden">
                ${{ (item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2) }} each
              </p>
            </div>

            <!-- Desktop Price -->
            <div class="hidden md:flex flex-col items-end justify-between flex-shrink-0">
              <div class="text-right">
                <p class="font-black text-stone-800 dark:text-stone-100 text-base">
                  ${{ (item.product.price * (1 - item.product.discountPercentage / 100) * item.quantity).toFixed(2) }}
                </p>
                <p class="text-xs text-stone-400 dark:text-stone-500">
                  ${{ (item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2) }} each
                </p>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-2">
                <div class="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
                  <button
                    @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                    class="px-2.5 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-sm transition-colors"
                  >−</button>
                  <span class="px-3 py-1.5 text-sm font-bold text-stone-800 dark:text-stone-100 min-w-[2rem] text-center">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                    :disabled="item.quantity >= item.product.stock"
                    class="px-2.5 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-sm transition-colors disabled:opacity-40"
                  >+</button>
                </div>
                <button
                  @click="cartStore.removeItem(item.product.id)"
                  class="p-1.5 text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                  aria-label="Remove item"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Mobile Controls Row -->
            <div class="w-full flex items-center justify-between md:hidden mt-2 absolute" style="display: none" />
          </div>
        </TransitionGroup>

        <!-- Mobile quantity controls are shown differently -->
        <!-- This is handled via the structure above for mobile -->

        <!-- Clear Cart -->
        <div class="flex justify-end pt-2">
          <button
            @click="cartStore.clearCart()"
            class="text-xs text-stone-400 dark:text-stone-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Clear entire cart
          </button>
        </div>
      </div>

      <!-- ── Order Summary ── -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-24">
          <h2 class="font-display text-xl font-black text-stone-900 dark:text-white mb-5">
            Order Summary
          </h2>

          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-sm text-stone-600 dark:text-stone-400">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="font-semibold text-stone-800 dark:text-stone-200">${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="cartStore.totalSavings > 0" class="flex justify-between text-sm">
              <span class="text-emerald-600 dark:text-emerald-400">Discount Savings</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">−${{ cartStore.totalSavings.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm text-stone-600 dark:text-stone-400">
              <span>Shipping</span>
              <span :class="cartStore.subtotal >= SHIPPING_THRESHOLD ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-800 dark:text-stone-200 font-semibold'">
                {{ cartStore.subtotal >= SHIPPING_THRESHOLD ? 'FREE' : '$5.99' }}
              </span>
            </div>
          </div>

          <div class="border-t border-stone-100 dark:border-stone-800 pt-4 mb-6">
            <div class="flex justify-between">
              <span class="font-display font-black text-stone-900 dark:text-white text-lg">Total</span>
              <span class="font-display font-black text-crimson-700 dark:text-crimson-400 text-2xl">
                ${{ (cartStore.subtotal + (cartStore.subtotal >= SHIPPING_THRESHOLD ? 0 : 5.99)).toFixed(2) }}
              </span>
            </div>
            <p v-if="cartStore.totalSavings > 0" class="text-xs text-emerald-600 dark:text-emerald-400 mt-1 text-right font-medium">
              You're saving ${{ cartStore.totalSavings.toFixed(2) }} 🎉
            </p>
          </div>

          <!-- Checkout CTA -->
          <div v-if="authStore.isLoggedIn">
            <button class="btn-primary w-full py-3.5 text-base">
              Proceed to Checkout
            </button>
            <p class="text-xs text-stone-400 dark:text-stone-500 text-center mt-3">
              Logged in as {{ authStore.displayName }}
            </p>
          </div>
          <div v-else class="space-y-3">
            <p class="text-sm text-stone-500 dark:text-stone-400 text-center">
              Please sign in to complete your order
            </p>
            <button
              @click="router.push('/login')"
              class="btn-primary w-full py-3.5 text-base"
            >
              Login to Checkout
            </button>
            <button
              @click="router.push('/login')"
              class="btn-ghost w-full py-2.5 text-sm"
            >
              Continue as Guest
            </button>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-stone-100 dark:border-stone-800">
            <div class="text-center">
              <div class="text-xl mb-1">🔒</div>
              <p class="text-[10px] text-stone-400 dark:text-stone-500 font-medium leading-tight">Secure Payment</p>
            </div>
            <div class="text-center">
              <div class="text-xl mb-1">↩️</div>
              <p class="text-[10px] text-stone-400 dark:text-stone-500 font-medium leading-tight">Easy Returns</p>
            </div>
            <div class="text-center">
              <div class="text-xl mb-1">⭐</div>
              <p class="text-[10px] text-stone-400 dark:text-stone-500 font-medium leading-tight">Top Rated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}
.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(16px);
  height: 0;
  margin: 0;
  padding: 0;
}
</style>
