<template>
  <div
    class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl"
  >
    <!-- Trophy Icon -->
    <div class="mb-6 flex justify-center">
      <img
        src="/icons/trophy.png"
        alt="Trophy"
        class="w-20 h-20 object-contain"
      />
    </div>

    <h2 class="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
    <p class="text-purple-200/70 mb-6">Great job, {{ playerName }}!</p>

    <!-- Quiz Details -->
    <div class="bg-white/5 rounded-xl p-5 mb-6 text-left space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-purple-200/60">Category</span>
        <span class="text-white font-medium">{{ category }}</span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-purple-200/60">Difficulty</span>
        <span class="text-white font-medium capitalize">
          {{ difficulty === 'any' ? 'Mixed' : difficulty }}
        </span>
      </div>

      <div
        v-if="tabSwitchCount > 0"
        class="flex justify-between text-sm bg-amber-500/5 rounded-lg px-3 py-2 -mx-2 items-center"
      >
        <div class="flex items-center gap-2">
          <img
            src="/icons/warning.png"
            alt="Warning"
            class="w-4 h-4"
          />
          <span class="text-amber-300/80">Tab Switches</span>
        </div>
        <span class="text-amber-300 font-bold">{{ tabSwitchCount }}</span>
      </div>
    </div>

    <!-- Score -->
    <div class="mb-6">
      <p class="text-purple-200/60 text-sm mb-1">Your Score</p>
      <p class="text-5xl font-bold text-amber-400">
        {{ score }} / {{ total }}
      </p>
    </div>

    <!-- Performance Message -->
    <p class="text-purple-200/80 mb-6">{{ performanceMessage }}</p>

    <!-- Integrity Notice -->
    <div
      v-if="tabSwitchCount > 0"
      class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-6"
    >
      <div class="flex items-center justify-center gap-2">
        <img
          src="/icons/warning.png"
          alt="Warning"
          class="w-4 h-4"
        />
        <p class="text-amber-300/80 text-xs">
          {{ tabSwitchCount }} tab switch(es) detected during the quiz.
        </p>
      </div>
    </div>

    <!-- Restart Button -->
    <button
      @click="$emit('restart')"
      class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
    >
      <span>Play Again</span>
       
      
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    score: number
    total: number
    playerName: string
    category: string
    difficulty: string
    tabSwitchCount?: number
  }>(),
  {
    tabSwitchCount: 0
  }
)

defineEmits<{
  restart: []
}>()

const performanceMessage = computed(() => {
  const percentage = (props.score / props.total) * 100

  const integrityNote =
    props.tabSwitchCount > 0
      ? ' (Quiz integrity may be compromised)'
      : ''

  if (percentage === 100) {
    return `Perfect score! You're a quiz master! 🎉${integrityNote}`
  }

  if (percentage >= 80) {
    return `Great job! You really know your stuff! 🌟${integrityNote}`
  }

  if (percentage >= 60) {
    return `Good effort! Keep learning! 📚${integrityNote}`
  }

  if (percentage >= 40) {
    return `Not bad! Practice makes perfect! 💪${integrityNote}`
  }

  return `Keep trying! You'll get better! 🌱${integrityNote}`
})
</script>