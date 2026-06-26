<template>
  <div class="flex gap-4 justify-center">
    <!-- Question Timer -->
    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 flex-1 max-w-[200px]">
      <div class="flex items-center justify-center gap-2 mb-2">
        <span class="text-sm">⏱️</span>
        <span class="text-purple-200/70 text-xs font-medium">Question</span>
      </div>
      
      <div class="relative w-20 h-20 mx-auto">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15.9155"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="3"
          />
          <circle
            cx="18" cy="18" r="15.9155"
            fill="none"
            :stroke="timerColor"
            stroke-width="3"
            stroke-linecap="round"
            :stroke-dasharray="`${timePercentage}, 100`"
            class="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div 
          class="absolute inset-0 flex items-center justify-center text-lg font-bold"
          :class="timerWarning ? 'text-red-400' : 'text-white'"
        >
          {{ timeLeft }}s
        </div>
      </div>
    </div>

    <!-- Total Timer -->
    <div 
      v-if="totalTime > 0"
      class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 flex-1 max-w-[200px]"
    >
      <div class="flex items-center justify-center gap-2 mb-2">
        <span class="text-sm">⌛</span>
        <span class="text-purple-200/70 text-xs font-medium">Total</span>
      </div>
      <div class="flex items-center justify-center h-20">
        <span 
          class="text-2xl font-mono font-bold"
          :class="totalTimeLeft <= 30 ? 'text-red-400' : 'text-white'"
        >
          {{ formatTime(totalTimeLeft) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  timeLeft: number
  totalTimeLeft: number
  totalTime: number
  timerWarning: boolean
  timePercentage: number
}>()

const timerColor = computed(() => {
  if (props.timeLeft <= 5) return '#ef4444'
  if (props.timerWarning) return '#f59e0b'
  return '#a855f7'
})

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>