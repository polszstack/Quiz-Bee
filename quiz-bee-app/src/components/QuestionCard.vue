<template>
  <div
    class="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 transition-all duration-300"
    :class="questionChanged ? 'border-amber-300 shadow-amber-100/50' : 'border-gray-200'"
  >
    <!-- Header badges -->
    <div class="flex items-center justify-between gap-2 mb-4">
      <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium truncate max-w-[60%]">
        {{ question.category }}
      </span>
      <span
        class="px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0"
        :class="difficultyClass"
      >
        {{ question.difficulty }}
      </span>
    </div>

    <!-- Question secured banner -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="questionChanged"
        class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4 flex items-center justify-center gap-2"
      >
        <svg
          class="w-3.5 h-3.5 text-amber-600"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span class="text-amber-700 text-xs font-medium">Question secured</span>
      </div>
    </Transition>

    <!-- Question text -->
    <h2
      class="text-gray-900 text-base sm:text-lg font-medium mb-5 sm:mb-6 leading-relaxed"
      :class="{ 'text-amber-700': questionChanged }"
    >
      {{ question.question }}
    </h2>

    <!-- Answer options -->
    <div
      class="grid grid-cols-1 gap-2.5 sm:gap-3"
      role="radiogroup"
      :aria-label="`Answer options for: ${question.question}`"
    >
      <button
        v-for="(opt, index) in cleanOptions"
        :key="opt.original"
        type="button"
        :disabled="showResult"
        :aria-pressed="selectedAnswer === opt.original"
        :class="[
          'group w-full text-left px-4 py-3 sm:py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3',
          optionStateClasses(opt, index),
        ]"
        @click="selectAnswer(opt.original)"
      >
        <!-- Shortcut badge -->
        <span
          class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors"
          :class="badgeClasses(opt, index)"
        >
          {{ index + 1 }}
        </span>

        <!-- Answer text -->
        <span class="flex-1 text-sm sm:text-base">{{ opt.cleaned }}</span>

        <!-- Correct icon -->
        <svg
          v-if="showResult && opt.original === cleanCorrectAnswer"
          class="w-5 h-5 text-green-600 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        <!-- Wrong icon (selected but not correct) -->
        <svg
          v-else-if="showResult && selectedAnswer === opt.original"
          class="w-5 h-5 text-red-600 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { QuestionWithAnswers, GameState } from '../types/quiz'
import { cleanAnswerText as sanitizeAnswer } from '../utils/sanitize'

const props = defineProps<{
  question: QuestionWithAnswers
  selectedAnswer: string | null
  isCorrect: boolean | null
  gameState: GameState
  questionChanged?: boolean
}>()

const emit = defineEmits<{ answer: [answer: string] }>()

/**
 * Sanitize each answer once and keep a reference to the original so
 * comparisons with `selectedAnswer` (which stores originals) stay accurate.
 */
const cleanOptions = computed(() =>
  props.question.answers.map(original => ({
    original,
    cleaned: sanitizeAnswer(original),
  }))
)

const cleanCorrectAnswer = computed(() =>
  sanitizeAnswer(props.question.correctAnswer)
)

const showResult = computed(
  () => props.gameState === 'answered' || props.gameState === 'timeout'
)

const difficultyClass = computed(() => {
  switch (props.question.difficulty) {
    case 'easy':   return 'bg-green-50 text-green-700 ring-1 ring-green-100'
    case 'medium': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
    case 'hard':   return 'bg-red-50 text-red-700 ring-1 ring-red-100'
    default:       return 'bg-gray-50 text-gray-700 ring-1 ring-gray-100'
  }
})

function optionStateClasses(
  opt: { original: string; cleaned: string },
  _index: number
): string {
  if (showResult.value) {
    if (opt.original === cleanCorrectAnswer.value)
      return 'border-green-500 bg-green-50 text-green-900'
    if (props.selectedAnswer === opt.original)
      return 'border-red-400 bg-red-50 text-red-900'
    return 'border-gray-200 bg-white text-gray-500 opacity-60'
  }
  if (props.selectedAnswer === opt.original)
    return 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm shadow-indigo-100'
  return 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/40 active:scale-[0.99]'
}

function badgeClasses(
  opt: { original: string; cleaned: string },
  _index: number
): string {
  if (showResult.value && opt.original === cleanCorrectAnswer.value)
    return 'bg-green-100 text-green-700'
  if (showResult.value && props.selectedAnswer === opt.original)
    return 'bg-red-100 text-red-700'
  if (props.selectedAnswer === opt.original)
    return 'bg-indigo-600 text-white'
  return 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
}

function selectAnswer(original: string) {
  if (showResult.value) return
  emit('answer', original)
}

/**
 * Keyboard shortcuts: 1–4 select answers while a question is active.
 */
function handleKey(e: KeyboardEvent) {
  if (showResult.value) return
  const num = parseInt(e.key, 10)
  if (Number.isNaN(num) || num < 1) return
  const opt = cleanOptions.value[num - 1]
  if (opt) {
    e.preventDefault()
    selectAnswer(opt.original)
  }
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))
</script>