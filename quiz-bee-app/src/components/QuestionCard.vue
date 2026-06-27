<template>
  <div 
    class="bg-white rounded-2xl shadow-sm border p-6 transition-all"
    :class="questionChanged ? 'border-amber-300' : 'border-gray-200'"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
        {{ displayQuestion.category }}
      </span>
      <span class="px-3 py-1 rounded-full text-xs font-medium capitalize" :class="difficultyClass">
        {{ displayQuestion.difficulty }}
      </span>
    </div>

    <div v-if="questionChanged" class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4 text-center">
      <span class="text-amber-700 text-xs font-medium">🔒 Question secured</span>
    </div>

    <h2 class="text-gray-900 text-lg font-medium mb-6 leading-relaxed" :class="{ 'text-amber-700': questionChanged }">
      {{ displayQuestion.question }}
    </h2>

    <div class="grid grid-cols-1 gap-3">
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

defineEmits<{ answer: [answer: string] }>()

const displayQuestion = computed(() => props.question)

const difficultyClass = computed(() => {
  const d = props.question.difficulty
  if (d === 'easy') return 'bg-green-50 text-green-700'
  if (d === 'medium') return 'bg-amber-50 text-amber-700'
  if (d === 'hard') return 'bg-red-50 text-red-700'
  return 'bg-gray-50 text-gray-700'
})

const originalCorrectAnswer = computed(() => cleanAnswer(props.question.correctAnswer))

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