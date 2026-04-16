<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  toggleDark: []
}>()

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

function handleLogout(): void {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- ── Logo ──────────────────────────────── -->
        <RouterLink
          to="/"
          class="flex items-center gap-2.5 group"
          @click="mobileMenuOpen = false"
        >
          <div class="w-9 h-9 bg-crimson-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span class="text-lg">🥩</span>
          </div>
          <div class="leading-none">
            <span class="font-display text-xl font-black text-crimson-700 dark:text-crimson-400">Prime</span>
            <span class="font-display text-xl font-black text-stone-700 dark:text-stone-200">Cuts</span>
          </div>
        </RouterLink>

        <!-- ── Desktop Nav ─────────────────────────── -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            to="/"
            class="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-crimson-700 dark:hover:text-crimson-400 hover:bg-crimson-50 dark:hover:bg-crimson-950/30 font-medium transition-all text-sm"
          >
            Shop
          </RouterLink>

          <!-- Auth Links -->
          <template v-if="authStore.isLoggedIn">
            <span class="px-4 py-2 text-stone-500 dark:text-stone-400 text-sm">
              👋 {{ authStore.user?.firstName }}
            </span>
            <button
              @click="handleLogout"
              class="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-crimson-700 dark:hover:text-crimson-400 hover:bg-crimson-50 dark:hover:bg-crimson-950/30 font-medium transition-all text-sm"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-crimson-700 dark:hover:text-crimson-400 hover:bg-crimson-50 dark:hover:bg-crimson-950/30 font-medium transition-all text-sm"
            >
              Login
            </RouterLink>
          </template>
        </div>

        <!-- ── Right Actions ─────────────────────── -->
        <div class="flex items-center gap-2">
          <!-- Dark Mode Toggle -->
          <button
            @click="emit('toggleDark')"
            class="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Transition name="spin" mode="out-in">
              <span :key="isDark ? 'dark' : 'light'" class="text-base">{{ isDark ? '☀️' : '🌙' }}</span>
            </Transition>
          </button>

          <!-- Cart Button -->
          <RouterLink
            to="/cart"
            class="relative w-9 h-9 flex items-center justify-center rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white transition-colors shadow-md"
            aria-label="Shopping cart"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <Transition name="badge">
              <span
                v-if="cartStore.totalItems > 0"
                class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-amber-400 text-stone-900 text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow"
              >
                {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
              </span>
            </Transition>
          </RouterLink>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ── Mobile Menu ─────────────────────────── -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-1 border-t border-stone-100 dark:border-stone-800 pt-3 mt-1">
          <RouterLink
            to="/"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-sm transition-colors"
          >
            🛍️ Shop
          </RouterLink>
          <template v-if="authStore.isLoggedIn">
            <div class="px-3 py-2 text-sm text-stone-500 dark:text-stone-400">
              Signed in as {{ authStore.displayName }}
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-crimson-600 dark:text-crimson-400 hover:bg-crimson-50 dark:hover:bg-crimson-950/30 font-medium text-sm transition-colors"
            >
              🚪 Logout
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-sm transition-colors"
            >
              🔐 Login
            </RouterLink>
          </template>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
.spin-enter-active,
.spin-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.spin-enter-from { opacity: 0; transform: rotate(-90deg) scale(0.5); }
.spin-leave-to   { opacity: 0; transform: rotate(90deg) scale(0.5); }

.badge-enter-active,
.badge-leave-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
