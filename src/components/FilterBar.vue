<script setup lang="ts">
import type { SortOption } from '../types'

defineProps<{
  searchQuery: string
  sortBy: SortOption
  resultCount: number
  isLoading: boolean
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:sortBy': [value: SortOption]
  'clear': []
}>()

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: '', label: 'Default Order' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Deals' },
  { value: 'name', label: 'Name A–Z' },
]
</script>

<template>
  <div class="card p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search Input -->
      <div class="flex-1 relative">
        <svg
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="search"
          placeholder="Search products, brands..."
          class="input-field pl-10 pr-10"
          autocomplete="off"
        />
        <button
          v-if="searchQuery"
          @click="emit('clear')"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          aria-label="Clear search"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Sort Select -->
      <select
        :value="sortBy"
        @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value as SortOption)"
        class="input-field sm:w-52 cursor-pointer"
      >
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Results summary -->
    <div class="mt-2.5 flex items-center justify-between">
      <p class="text-xs text-stone-400 dark:text-stone-500">
        <template v-if="isLoading">
          <span class="inline-flex items-center gap-1">
            <svg class="w-3 h-3 animate-spin text-crimson-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading...
          </span>
        </template>
        <template v-else>
          <span>{{ resultCount }} product{{ resultCount !== 1 ? 's' : '' }} found</span>
          <span v-if="searchQuery" class="text-crimson-500 dark:text-crimson-400 ml-1">for "{{ searchQuery }}"</span>
        </template>
      </p>
    </div>
  </div>
</template>
