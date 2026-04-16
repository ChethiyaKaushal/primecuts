import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, LoginCredentials } from '../types'

export const useAuthStore = defineStore('auth', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const user = ref<AuthUser | null>(
    (() => {
      try {
        const stored = localStorage.getItem('auth_user')
        return stored ? (JSON.parse(stored) as AuthUser) : null
      } catch {
        return null
      }
    })()
  )

  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const isLoggedIn = computed(() => user.value !== null && !!user.value.accessToken)

  const displayName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  // ─── Actions ──────────────────────────────────────────────────────────────
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          expiresInMins: 60,
        }),
      })

      if (!response.ok) {
        const data = await response.json() as { message?: string }
        throw new Error(data.message ?? 'Invalid username or password')
      }

      const data = await response.json() as AuthUser
      user.value = data
      localStorage.setItem('auth_user', JSON.stringify(data))
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    user.value = null
    error.value = null
    localStorage.removeItem('auth_user')
  }

  function clearError(): void {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    displayName,
    login,
    logout,
    clearError,
  }
})
