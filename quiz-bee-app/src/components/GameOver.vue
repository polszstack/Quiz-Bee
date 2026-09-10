<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
    <!-- Trophy with subtle glow -->
    <div class="relative inline-flex items-center justify-center mb-5 sm:mb-6">
      <div
        class="absolute inset-0 rounded-full blur-2xl opacity-60"
        :class="tierGlowClass"
      ></div>
      <img
        src="/icons/trophy.png"
        alt="Trophy"
        class="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm"
        :class="{ 'animate-bounce-slow': isPerfect }"
      />
    </div>

    <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Quiz Complete!</h2>
    <p class="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
      Great job, <span class="font-medium text-gray-700">{{ playerName }}</span>!
    </p>

    <!-- Score ring -->
    <div class="flex flex-col items-center mb-6 sm:mb-8">
      <div class="relative w-32 h-32 sm:w-36 sm:h-36">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <!-- Track -->
          <circle
            cx="50" cy="50" r="44"
            fill="none" stroke="#e5e7eb" stroke-width="8"
          />
          <!-- Progress -->
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            :stroke="tierStrokeColor"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl sm:text-4xl font-bold text-gray-900">{{ score }}</span>
          <span class="text-xs sm:text-sm text-gray-400">of {{ total }}</span>
        </div>
      </div>

      <div class="mt-3 flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
          :class="tierBadgeClass"
        >
          {{ percentage }}% · {{ tierLabel }}
        </span>
      </div>
    </div>

    <!-- Performance message -->
    <p class="text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
      {{ performanceMessage }}
    </p>

    <!-- Quiz config recap -->
    <div class="bg-gray-50 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5 space-y-2 text-left">
      <div class="flex justify-between text-xs sm:text-sm">
        <span class="text-gray-500">Category</span>
        <span class="text-gray-900 font-medium truncate ml-2">{{ category }}</span>
      </div>
      <div class="flex justify-between text-xs sm:text-sm">
        <span class="text-gray-500">Difficulty</span>
        <span class="text-gray-900 font-medium capitalize">
          {{ difficulty === 'any' ? 'Mixed' : difficulty }}
        </span>
      </div>
    </div>

    <!-- Integrity warning (only shown if needed, and only once) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="hasIntegrityConcern"
        class="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 flex items-start gap-2 sm:gap-3 text-left"
      >
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-0.5"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3l-6.93-12a2 2 0 00-3.48 0L2.33 16a2 2 0 001.74 3z" />
        </svg>
        <div class="flex-1">
          <p class="text-amber-800 text-xs sm:text-sm font-medium">
            {{ tabSwitchCount }} tab switch{{ tabSwitchCount === 1 ? '' : 'es' }} detected
          </p>
          <p class="text-amber-600 text-[11px] sm:text-xs mt-0.5">
            Result integrity may be affected.
          </p>
        </div>
      </div>
    </Transition>

    <!-- Actions -->
    <div class="space-y-2 sm:space-y-3">
      <button
        @click="$emit('restart')"
        class="group w-full bg-indigo-600 text-white font-medium py-2.5 sm:py-3 px-6 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Play Again
      </button>
      <button
        @click="$emit('changeSettings')"
        class="w-full text-gray-500 py-2 px-4 rounded-xl hover:bg-gray-100 transition-colors text-xs sm:text-sm"
      >
        ← Change Settings
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  score: number
  total: number
  playerName: string
  category: string
  difficulty: string
  tabSwitchCount?: number
}>(), { tabSwitchCount: 0 })

defineEmits<{
  restart: []
  changeSettings: []
}>()

const circumference = 2 * Math.PI * 44
const dashOffset = ref(circumference)

const percentage = computed(() =>
  props.total > 0 ? Math.round((props.score / props.total) * 100) : 0
)

const isPerfect = computed(() => percentage.value === 100)
const hasIntegrityConcern = computed(() => props.tabSwitchCount > 0)

// Animate the ring on mount
onMounted(() => {
  requestAnimationFrame(() => {
    dashOffset.value = circumference - (percentage.value / 100) * circumference
  })
})

// ---- Tier styling ----
const tierLabel = computed(() => {
  if (percentage.value === 100) return 'Perfect'
  if (percentage.value >= 80) return 'Excellent'
  if (percentage.value >= 60) return 'Good'
  if (percentage.value >= 40) return 'Fair'
  return 'Keep Trying'
})

const tierStrokeColor = computed(() => {
  if (percentage.value >= 80) return '#16a34a' // green-600
  if (percentage.value >= 60) return '#4f46e5' // indigo-600
  if (percentage.value >= 40) return '#f59e0b' // amber-500
  return '#ef4444'                            // red-500
})

const tierBadgeClass = computed(() => {
  if (percentage.value >= 80) return 'bg-green-50 text-green-700 ring-1 ring-green-100'
  if (percentage.value >= 60) return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'
  if (percentage.value >= 40) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
  return 'bg-red-50 text-red-700 ring-1 ring-red-100'
})

const tierGlowClass = computed(() => {
  if (percentage.value >= 80) return 'bg-green-200/50'
  if (percentage.value >= 60) return 'bg-indigo-200/50'
  if (percentage.value >= 40) return 'bg-amber-200/50'
  return 'bg-red-200/50'
})

// ---- Performance message (no more inline emoji or appended warning) ----
const performanceMessage = computed(() => {
  const p = percentage.value
  if (p === 100) return "A flawless run — you're a true Quiz Bee champion!"
  if (p >= 80)   return 'Excellent work! You really know your stuff.'
  if (p >= 60)   return 'Solid effort — a little more practice and you\'ll ace it.'
  if (p >= 40)   return 'Not bad! Every quiz makes you sharper.'
  return 'Everyone starts somewhere — try again and you\'ll improve fast.'
})
</script>

<style scoped>
/* Optional: pause-safe bounce for the perfect-score trophy */
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-bounce-slow { animation: none; }
}
</style>