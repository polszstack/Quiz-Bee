<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
    <div class="text-center mb-8">
      <div class="mb-4 flex justify-center">
        <img 
          src="/icons/bee2.png" 
          alt="Quiz Bee" 
          class="w-24 h-24 object-contain"
        />
      </div>
      <h2 class="text-2xl font-bold text-white">Welcome to Quiz Bee!</h2>
      <p class="text-purple-200/70 mt-2">Configure your quiz settings</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Name Input -->
      <div>
        <label for="playerName" class="block text-sm font-medium text-purple-200/80 mb-2">
          Your Name
        </label>
        <input
          id="playerName"
          v-model="playerName"
          type="text"
          placeholder="Enter your name"
          maxlength="30"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 transition-all duration-200"
          required
        />
      </div>

      <!-- Category Select -->
      <div>
        <label for="category" class="block text-sm font-medium text-purple-200/80 mb-2">
          Category
        </label>
        <select
          id="category"
          v-model="selectedCategory"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 transition-all duration-200 appearance-none cursor-pointer"
          @focus="loadCategoriesEmit"
        >
          <option value="0" class="bg-slate-800">Any Category</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            class="bg-slate-800"
          >
            {{ category.name }}
          </option>
        </select>
        <p v-if="categoriesLoading" class="text-purple-300/60 text-xs mt-1">Loading categories...</p>
      </div>

      <!-- Difficulty Select -->
      <div>
        <label for="difficulty" class="block text-sm font-medium text-purple-200/80 mb-2">
          Difficulty
        </label>
        <select
          id="difficulty"
          v-model="selectedDifficulty"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="any" class="bg-slate-800">Any Difficulty</option>
          <option value="easy" class="bg-slate-800">Easy</option>
          <option value="medium" class="bg-slate-800">Medium</option>
          <option value="hard" class="bg-slate-800">Hard</option>
        </select>
      </div>

      <!-- Timer Settings -->
      <div class="bg-white/5 rounded-xl p-5 space-y-4">
        <h3 class="text-sm font-semibold text-purple-200/90 text-center">⚡ Timer Settings</h3>
        
        <div>
          <label for="questionTime" class="block text-xs font-medium text-purple-200/60 mb-2">
            Time per Question
          </label>
          <select
            id="questionTime"
            v-model="questionTime"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400/50 transition-all duration-200 cursor-pointer"
          >
            <option :value="15" class="bg-slate-800">15 seconds (Fast)</option>
            <option :value="30" class="bg-slate-800">30 seconds (Normal)</option>
            <option :value="45" class="bg-slate-800">45 seconds (Relaxed)</option>
            <option :value="60" class="bg-slate-800">60 seconds (Easy)</option>
          </select>
        </div>

        <div>
          <label for="totalTime" class="block text-xs font-medium text-purple-200/60 mb-2">
            Total Game Time (optional)
          </label>
          <select
            id="totalTime"
            v-model="totalTime"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400/50 transition-all duration-200 cursor-pointer"
          >
            <option :value="0" class="bg-slate-800">No Time Limit</option>
            <option :value="120" class="bg-slate-800">2 minutes</option>
            <option :value="300" class="bg-slate-800">5 minutes</option>
            <option :value="600" class="bg-slate-800">10 minutes</option>
          </select>
        </div>
      </div>

      <button 
        type="submit"
        class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Start Quiz 🚀
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
      {
        questionTime: questionTime.value,
        totalTime: totalTime.value
      }
    )
  }
}
</script>