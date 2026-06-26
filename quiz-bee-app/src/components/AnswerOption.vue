<template>
  <button
    @click="!disabled && $emit('select')"
    :disabled="disabled"
    class="relative group w-full text-left p-4 rounded-xl border-2 transition-all duration-200"
    :class="buttonClasses"
  >
    <div class="flex items-center gap-3">
      <span 
        class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200"
        :class="letterClasses"
      >
        {{ letters[index] }}
      </span>
      <span class="text-sm font-medium flex-1">{{ answer }}</span>
      <span v-if="showResult && isCorrect" class="text-emerald-400 text-lg">✓</span>
      <span v-if="showResult && isSelected && !isCorrect" class="text-red-400 text-lg">✗</span>
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

defineEmits<{
  select: []
}>()

const buttonClasses = computed(() => {
  if (props.showResult && props.isCorrect) {
    return 'border-emerald-500/50 bg-emerald-500/10 cursor-not-allowed'
  }
  if (props.showResult && props.isSelected && !props.isCorrect) {
    return 'border-red-500/50 bg-red-500/10 cursor-not-allowed'
  }
  if (props.isSelected) {
    return 'border-purple-400/50 bg-purple-500/20'
  }
  if (props.disabled) {
    return 'border-white/5 bg-white/5 cursor-not-allowed opacity-50'
  }
  return 'border-white/10 bg-white/5 hover:border-purple-400/40 hover:bg-white/10 cursor-pointer'
})

const letterClasses = computed(() => {
  if (props.showResult && props.isCorrect) {
    return 'bg-emerald-500/30 text-emerald-300'
  }
  if (props.showResult && props.isSelected && !props.isCorrect) {
    return 'bg-red-500/30 text-red-300'
  }
  if (props.isSelected) {
    return 'bg-purple-500/30 text-purple-200'
  }
  return 'bg-white/5 text-purple-200/60 group-hover:bg-white/10'
})
</script>