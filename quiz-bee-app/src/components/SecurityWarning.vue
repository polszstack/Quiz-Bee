<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="rounded-xl p-4 flex items-start gap-3 border" :class="warningClasses">
      <span class="text-lg">{{ icon }}</span>
      <span class="text-sm font-medium flex-1">{{ message }}</span>
      <button @click="$emit('dismiss')" class="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ show: boolean; message: string; tabSwitchCount: number }>()
defineEmits<{ dismiss: [] }>()

const warningClasses = computed(() => {
  if (props.tabSwitchCount >= 3) return 'bg-red-50 border-red-200 text-red-700'
  if (props.tabSwitchCount >= 2) return 'bg-orange-50 border-orange-200 text-orange-700'
  return 'bg-amber-50 border-amber-200 text-amber-700'
})

const icon = computed(() => {
  if (props.tabSwitchCount >= 3) return '⛔'
  if (props.tabSwitchCount >= 2) return '🚫'
  return '⚠️'
})
</script>