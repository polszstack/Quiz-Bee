<template>
  <div class="flex justify-center">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-full max-w-50">
      <p class="text-xs text-gray-500 text-center mb-2">Time Remaining</p>
      <div class="relative w-20 h-20 mx-auto">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f3f4f6" stroke-width="3" />
          <circle 
            cx="18" cy="18" r="15.9155" fill="none" :stroke="timerColor" stroke-width="3" 
            stroke-linecap="round" :stroke-dasharray="`${timePercentage}, 100`"
            class="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-xl font-bold" :class="timerWarning ? 'text-red-500' : 'text-gray-900'">
            {{ timeLeft }}
          </span>
        </div>
      </div>
      <p class="text-xs text-gray-400 text-center mt-1">seconds</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  timeLeft: number
  totalTimeLeft?: number
  totalTime?: number
  timerWarning: boolean
  timePercentage: number
}>()

const timerColor = computed(() => {
  if (props.timeLeft <= 5) return '#ef4444'
  if (props.timerWarning) return '#f59e0b'
  return '#4f46e5'
})
</script>