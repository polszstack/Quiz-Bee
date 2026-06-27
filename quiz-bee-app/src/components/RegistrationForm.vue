<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
    <div class="text-center mb-8">
      <img src="/icons/bee.png" alt="Quiz Bee" class="w-16 h-16 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900">Welcome to Quiz Bee!</h2>
      <p class="text-gray-500 mt-1">Configure your quiz settings</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Your Name (don't use your real name)</label>
        <input
          v-model="playerName"
          type="text"
          placeholder="Enter your name"
          maxlength="30"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
        <select
          v-model="selectedCategory"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          @focus="loadCategoriesEmit"
        >
          <option value="0">Any Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <p v-if="categoriesLoading" class="text-gray-400 text-xs mt-1">Loading categories...</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
        <select
          v-model="selectedDifficulty"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
        >
          <option value="any">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div class="bg-gray-50 rounded-xl p-5 space-y-4">
        <h3 class="text-sm font-semibold text-gray-700 text-center">Timer Settings</h3>
        
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Time per Question</label>
          <select
            v-model="questionTime"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option :value="15">15 seconds (Fast)</option>
            <option :value="30">30 seconds (Normal)</option>
            <option :value="45">45 seconds (Relaxed)</option>
            <option :value="60">60 seconds (Easy)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Total Game Time (optional)</label>
          <select
            v-model="totalTime"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option :value="0">No Time Limit</option>
            <option :value="120">2 minutes</option>
            <option :value="300">5 minutes</option>
            <option :value="600">10 minutes</option>
          </select>
        </div>
      </div>

      <button 
        type="submit"
        class="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Start Quiz
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
const questionTime = ref(30)
const totalTime = ref(0)

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
      { questionTime: questionTime.value, totalTime: totalTime.value }
    )
  }
}
</script>