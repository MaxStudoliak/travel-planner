<script setup lang="ts">
import { useTransition } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  value: number
  duration?: number
}>()

const source = ref(0)
const animated = useTransition(source, {
  duration: props.duration ?? 700
})

watch(
  () => props.value,
  value => {
    source.value = value
  },
  { immediate: true }
)

const display = computed(() => Math.round(animated.value))
</script>

<template>
  <span>{{ display }}</span>
</template>
