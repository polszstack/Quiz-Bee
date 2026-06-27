<template>
  <div class="flex gap-3">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1">
      <p class="text-xs text-gray-500 text-center mb-2">Question Time</p>
      <div class="relative w-16 h-16 mx-auto">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f3f4f6" stroke-width="3" />
          <circle 
            cx="18" cy="18" r="15.9155" fill="none" :stroke="timerColor" stroke-width="3" 
            stroke-linecap="round" :stroke-dasharray="`${timePercentage}, 100`"
            class="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-sm font-bold" :class="timerWarning ? 'text-red-500' : 'text-gray-900'">
            {{ timeLeft }}
          </span>
        </div>
      </div>
      <p class="text-xs text-gray-400 text-center mt-1">seconds</p>
    </div>

    <div v-if="totalTime > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1">
      <p class="text-xs text-gray-500 text-center mb-2">Total Time</p>
      <div class="flex items-center justify-center h-16">
        <span class="text-xl font-mono font-bold" :class="totalTimeLeft <= 30 ? 'text-red-500' : 'text-gray-900'">
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
  return '#4f46e5'
})

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>