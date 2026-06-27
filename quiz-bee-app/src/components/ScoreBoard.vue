<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <span class="text-indigo-600 text-sm font-medium">{{ playerName.charAt(0).toUpperCase() }}</span>
        </div>
        <span class="text-gray-900 font-medium text-sm">{{ playerName }}</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-xs text-gray-500">Score</p>
          <p class="text-lg font-bold text-indigo-600">{{ score }}/{{ total }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500">Question</p>
          <p class="text-lg font-bold text-gray-900">{{ currentQuestion }}/{{ total }}</p>
        </div>
      </div>
    </div>
    
    <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div 
        class="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: number
  total: number
  currentQuestion: number
  progress: number
  playerName: string
}>()
</script>