<script setup lang="ts">
import { computed } from 'vue'
import type { Trip } from '../types/travel'
import { tripChecklistProgress, tripPlacesProgress } from '../utils/trip-ui'

const props = defineProps<{
  trip: Trip
  compact?: boolean
}>()

const places = computed(() => tripPlacesProgress(props.trip))
const checklist = computed(() => tripChecklistProgress(props.trip))
</script>

<template>
  <div class="space-y-3" :class="compact ? 'text-xs' : 'text-sm'">
    <div class="space-y-1.5">
      <div class="flex justify-between gap-2 text-muted">
        <span class="flex items-center gap-1.5">
          <UIcon name="i-lucide-map-pin" class="size-3.5" />
          Місця
        </span>
        <span>{{ places.done }} / {{ places.total }}</span>
      </div>
      <UProgress :model-value="places.percent" :max="100" size="sm" />
    </div>
    <div class="space-y-1.5">
      <div class="flex justify-between gap-2 text-muted">
        <span class="flex items-center gap-1.5">
          <UIcon name="i-lucide-luggage" class="size-3.5" />
          Валіза
        </span>
        <span>{{ checklist.done }} / {{ checklist.total }}</span>
      </div>
      <UProgress :model-value="checklist.percent" :max="100" size="sm" color="success" />
    </div>
  </div>
</template>
