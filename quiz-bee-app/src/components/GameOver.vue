<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
    <img src="/icons/trophy.png" alt="Trophy" class="w-20 h-20 mx-auto mb-6" />
    
    <h2 class="text-xl font-semibold text-gray-900 mb-1">Quiz Complete!</h2>
    <p class="text-gray-500 mb-6">Great job, {{ playerName }}!</p>

    <div class="bg-gray-50 rounded-xl p-5 mb-6 space-y-2 text-left">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Category</span>
        <span class="text-gray-900 font-medium">{{ category }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Difficulty</span>
        <span class="text-gray-900 font-medium capitalize">{{ difficulty === 'any' ? 'Mixed' : difficulty }}</span>
      </div>
      <div v-if="tabSwitchCount > 0" class="flex justify-between text-sm bg-amber-50 rounded-lg px-3 py-2 -mx-2">
        <span class="text-amber-700">Tab Switches</span>
        <span class="text-amber-700 font-bold">{{ tabSwitchCount }}</span>
      </div>
    </div>

    <div class="mb-6">
      <p class="text-gray-500 text-sm mb-1">Your Score</p>
      <p class="text-4xl font-bold text-indigo-600">{{ score }} / {{ total }}</p>
    </div>

    <p class="text-gray-600 mb-6">{{ performanceMessage }}</p>

    <div v-if="tabSwitchCount > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
      <p class="text-amber-700 text-xs">{{ tabSwitchCount }} tab switch(es) detected.</p>
    </div>

    <button 
      @click="$emit('restart')"
      class="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors"
    >
      Play Again
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  score: number
  total: number
  playerName: string
  category: string
  difficulty: string
  tabSwitchCount?: number
}>(), { tabSwitchCount: 0 })

defineEmits<{ restart: [] }>()

const performanceMessage = computed(() => {
  const percentage = (props.score / props.total) * 100
  const note = props.tabSwitchCount > 0 ? ' (Integrity may be compromised)' : ''
  
  if (percentage === 100) return `Perfect score! You're a quiz master! 🎉${note}`
  if (percentage >= 80) return `Great job! You really know your stuff! 🌟${note}`
  if (percentage >= 60) return `Good effort! Keep learning! 📚${note}`
  if (percentage >= 40) return `Not bad! Practice makes perfect! 💪${note}`
  return `Keep trying! You'll get better! 🌱${note}`
})
</script>