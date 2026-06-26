<template>
  <div 
    class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border relative overflow-hidden transition-all duration-300"
    :class="questionChanged ? 'border-amber-500/30' : 'border-white/20'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <span class="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
        {{ displayQuestion.category }}
      </span>
      <span 
        class="px-3 py-1 rounded-full text-xs font-medium capitalize"
        :class="difficultyClass"
      >
        {{ displayQuestion.difficulty }}
      </span>
    </div>

    <!-- Anti-Cheat Notice -->
    <div 
      v-if="questionChanged"
      class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg px-4 py-2 mb-4 text-center"
    >
      <span class="text-purple-200 text-xs font-medium">🔒 Question secured for anti-cheating</span>
    </div>

    <!-- Question -->
    <h2 
      class="text-white text-lg font-medium mb-6 leading-relaxed"
      :class="{ 'text-amber-300/90': questionChanged }"
    >
      {{ displayQuestion.question }}
    </h2>

    <!-- Answers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <AnswerOption
        v-for="(answer, index) in displayQuestion.answers"
        :key="index"
        :answer="cleanAnswer(answer)"
        :index="index"
        :isSelected="selectedAnswer === getOriginalAnswer(answer)"
        :isCorrect="gameState === 'answered' || gameState === 'timeout' ? getOriginalAnswer(answer) === originalCorrectAnswer : null"
        :showResult="gameState === 'answered' || gameState === 'timeout'"
        :disabled="gameState === 'answered' || gameState === 'timeout'"
        @select="$emit('answer', getOriginalAnswer(answer))"
      />
    </div>

    <!-- Watermark -->
    <div 
      v-if="questionChanged"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-4xl font-bold text-red-500/5 pointer-events-none select-none whitespace-nowrap"
    >
      ANTI-CHEAT ACTIVE
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QuestionWithAnswers, GameState } from '../types/quiz'
import AnswerOption from './AnswerOption.vue'

const props = defineProps<{
  question: QuestionWithAnswers
  selectedAnswer: string | null
  isCorrect: boolean | null
  gameState: GameState
  questionChanged?: boolean
}>()

defineEmits<{
  answer: [answer: string]
}>()

const displayQuestion = computed(() => props.question)

const difficultyClass = computed(() => {
  const d = props.question.difficulty
  if (d === 'easy') return 'bg-emerald-500/20 text-emerald-300'
  if (d === 'medium') return 'bg-amber-500/20 text-amber-300'
  if (d === 'hard') return 'bg-red-500/20 text-red-300'
  return 'bg-purple-500/20 text-purple-200'
})

const originalCorrectAnswer = computed(() => {
  return cleanAnswer(props.question.correctAnswer)
})

function cleanAnswer(answer: string): string {
  return answer
    .replace(/\s*\(verify source\)/gi, '')
    .replace(/\s*\[citation needed\]/gi, '')
    .replace(/\s*-\s*multiple sources/gi, '')
    .replace(/\s*\(check references\)/gi, '')
    .replace(/\s*\[cross-reference required\]/gi, '')
    .replace(/\s*\{see documentation\}/gi, '')
    .replace(/\s*<<confirm>>/gi, '')
    .replace(/\s*\|\|validate\|\|/gi, '')
    .trim()
}

function getOriginalAnswer(answer: string): string {
  return cleanAnswer(answer)
}
</script>