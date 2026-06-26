<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-lg">👤</span>
        <span class="text-white font-medium">{{ playerName }}</span>
      </div>
    </div>
    
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-sm">⭐</span>
        <span class="text-amber-400 font-bold">{{ score }}/{{ total }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm">📝</span>
        <span class="text-purple-200/80 text-sm">Question {{ currentQuestion }} of {{ total }}</span>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
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