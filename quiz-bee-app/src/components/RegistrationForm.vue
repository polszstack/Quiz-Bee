<template>
  <div class="relative bg-white rounded-3xl shadow-2xl shadow-indigo-100/60 border border-gray-100/80 p-8 max-w-md w-full overflow-hidden">
    <!-- Decorative gradient blobs -->
    <div class="absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br from-amber-200/50 to-orange-100/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-indigo-200/40 to-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Header -->
    <div class="relative text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-indigo-50 ring-1 ring-indigo-100/80 mb-4 shadow-lg shadow-indigo-100/50">
        <img src="/icons/bee.png" alt="Quiz Bee" class="w-12 h-12 drop-shadow-sm" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Welcome to Quiz Bee!</h2>
      <p class="text-gray-500 mt-1.5 text-sm">Configure your quiz settings to get started</p>
    </div>

    <form @submit.prevent="handleSubmit" class="relative space-y-5">
      <!-- Name -->
      <div>
        <label for="playerName" class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
          <span class="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50">
            <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          Your Name
        </label>
        <input
          id="playerName"
          v-model="playerName"
          type="text"
          placeholder="Enter a nickname"
          maxlength="30"
          class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white focus:shadow-sm focus:shadow-indigo-100/50 transition-all duration-200"
          required
        />
        <p class="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Don't use your real name
        </p>
      </div>

      <!-- Category -->
      <div>
        <label for="category" class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
          <span class="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50">
            <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </span>
          Category
        </label>
        <div class="relative">
          <select
            id="category"
            v-model="selectedCategory"
            class="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-gray-900 bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white focus:shadow-sm focus:shadow-indigo-100/50 transition-all duration-200 cursor-pointer"
            @focus="loadCategoriesEmit"
          >
            <option value="0">Any Category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <p v-if="categoriesLoading" class="text-gray-400 text-xs mt-1.5 flex items-center gap-1.5">
          <span class="inline-block w-3 h-3 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></span>
          Loading categories...
        </p>
      </div>

      <!-- Difficulty -->
      <div>
        <label class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
          <span class="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50">
            <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          Difficulty
        </label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="option in difficultyOptions"
            :key="option.value"
            type="button"
            @click="selectedDifficulty = option.value"
            :class="[
              'px-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border',
              selectedDifficulty === option.value
                ? 'bg-gradient-to-b from-indigo-600 to-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-200/70 scale-[1.02]'
                : 'bg-gray-50/60 text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="group relative w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg hover:shadow-indigo-200/80 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden"
      >
        <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        <span class="relative">Start Quiz</span>
        <svg class="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QuizCategory, Difficulty } from '../types/quiz'

const props = defineProps<{
  categories: QuizCategory[]
  categoriesLoading: boolean
}>()

const emit = defineEmits<{
  register: [name: string, category: number, difficulty: Difficulty, settings: { questionTime: number; totalTime: number }]
  loadCategories: []
}>()

const playerName = ref('')
const selectedCategory = ref(0)
const selectedDifficulty = ref<Difficulty>('any')

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

function loadCategoriesEmit() {
  if (props.categories.length === 0) {
    emit('loadCategories')
  }
}

function handleSubmit() {
  if (playerName.value.trim()) {
    emit('register',
      playerName.value.trim(),
      selectedCategory.value,
      selectedDifficulty.value,
      { questionTime: 25, totalTime: 0 }
    )
  }
}
</script>