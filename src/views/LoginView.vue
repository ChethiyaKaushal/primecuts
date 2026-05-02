<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('emilys')
const password = ref('emilyspass')
const showPassword = ref(false)

onMounted(() => {
  // Redirect if already logged in
  if (authStore.isLoggedIn) {
    router.replace({ name: 'home' })
  }
  // Clear any previous errors
  authStore.clearError()
})

async function handleSubmit(): Promise<void> {
  if (!username.value.trim() || !password.value.trim()) return
  const success = await authStore.login({
    username: username.value.trim(),
    password: password.value,
  })
  if (success) {
    router.replace({ name: 'home' })
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-stone-50 to-crimson-50 dark:from-stone-950 dark:to-stone-900">

    <div class="w-full max-w-md animate-slide-up">
      <!-- Card -->
      <div class="card p-8 shadow-xl">

        <!-- Logo & Header -->
        <div class="text-center mb-8">
          <div class="inline-flex w-16 h-16 items-center justify-center bg-crimson-700 rounded-2xl shadow-lg mb-4">
            <span class="text-3xl">🥩</span>
          </div>
          <h1 class="font-display text-3xl font-black text-stone-900 dark:text-white"> Welcome Back </h1>
          <p class="text-stone-500 dark:text-stone-400 text-sm mt-1.5">Sign in to your Prime Cuts account</p>
        </div>

        <!-- Demo Hint Box -->
        <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-3.5 mb-6">
          <p class="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1.5">🔑 Demo Credentials (pre-filled)</p>
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-600 dark:text-blue-400">
            <span>Username: <code class="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded font-mono">emilys</code></span>
            <span>Password: <code class="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded font-mono">emilyspass</code></span>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
          <!-- Username -->
          <div>
            <label
              for="username"
              class="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              autocomplete="username"
              required
              class="input-field"
              :class="authStore.error ? 'border-red-400 dark:border-red-600 focus:ring-red-400' : ''"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
            >
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
                class="input-field pr-12"
                :class="authStore.error ? 'border-red-400 dark:border-red-600 focus:ring-red-400' : ''"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <Transition name="error-slide">
            <div
              v-if="authStore.error"
              class="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-3.5 text-sm"
            >
              <svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-red-700 dark:text-red-400">{{ authStore.error }}</span>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading || !username.trim() || !password.trim()"
            class="btn-primary w-full py-3.5 text-base mt-2"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Divider & Back -->
        <div class="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
          <RouterLink
            to="/"
            class="text-sm text-stone-500 dark:text-stone-400 hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors"
          >
            ← Back to Shop
          </RouterLink>
        </div>
      </div>

      <!-- Additional Info -->
      <p class="text-center text-xs text-stone-400 dark:text-stone-500 mt-4">
        Authentication powered by DummyJSON. JWT stored securely in localStorage.
      </p>
    </div>
  </main>
</template>

<style scoped>
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.25s ease;
}
.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
.error-slide-enter-to,
.error-slide-leave-from {
  max-height: 80px;
}
</style>
