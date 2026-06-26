<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div 
      v-if="show"
      class="rounded-xl p-4 flex items-start gap-3 border"
      :class="warningClasses"
    >
      <span class="text-xl flex-shrink-0">{{ icon }}</span>
      <span class="text-sm font-medium flex-1">{{ message }}</span>
      <button 
        @click="$emit('dismiss')"
        class="text-white/40 hover:text-white/80 transition-colors flex-shrink-0"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  message: string
  tabSwitchCount: number
}>()

defineEmits<{
  dismiss: []
}>()

const warningClasses = computed(() => {
  if (props.tabSwitchCount >= 3) {
    return 'bg-red-500/10 border-red-500/30 text-red-300'
  }
  if (props.tabSwitchCount >= 2) {
    return 'bg-orange-500/10 border-orange-500/30 text-orange-300'
  }
  return 'bg-amber-500/10 border-amber-500/30 text-amber-300'
})

const icon = computed(() => {
  if (props.tabSwitchCount >= 3) return '⛔'
  if (props.tabSwitchCount >= 2) return '🚫'
  return '⚠️'
})
</script>