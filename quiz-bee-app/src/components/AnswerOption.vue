<template>
  <button
    @click="!disabled && $emit('select')"
    :disabled="disabled"
    class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200"
    :class="buttonClasses"
  >
    <div class="flex items-center gap-3">
      <span class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold" :class="letterClasses">
        {{ letters[index] }}
      </span>
      <span class="text-sm text-gray-900 flex-1">{{ answer }}</span>
      <span v-if="showResult && isCorrect" class="text-green-500 font-bold">✓</span>
      <span v-if="showResult && isSelected && !isCorrect" class="text-red-500 font-bold">✗</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const letters = ['A', 'B', 'C', 'D']

const props = defineProps<{
  answer: string
  index: number
  isSelected: boolean
  isCorrect: boolean | null
  showResult: boolean
  disabled: boolean
}>()

defineEmits<{ select: [] }>()

const buttonClasses = computed(() => {
  if (props.showResult && props.isCorrect) return 'border-green-300 bg-green-50 cursor-default'
  if (props.showResult && props.isSelected && !props.isCorrect) return 'border-red-300 bg-red-50 cursor-default'
  if (props.isSelected) return 'border-indigo-400 bg-indigo-50'
  if (props.disabled) return 'border-gray-200 bg-gray-50 cursor-default opacity-60'
  return 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
})

const letterClasses = computed(() => {
  if (props.showResult && props.isCorrect) return 'bg-green-100 text-green-700'
  if (props.showResult && props.isSelected && !props.isCorrect) return 'bg-red-100 text-red-700'
  if (props.isSelected) return 'bg-indigo-100 text-indigo-700'
  return 'bg-gray-100 text-gray-600'
})
</script>