<script setup lang="ts">
import { computed } from 'vue'
import { useAppToast } from '../composables/useAppToast'
import { useTravelStore } from '../stores/travel'
import type { Trip, TripStatus } from '../types/travel'
import { countryFlag } from '../utils/country'
import { TRIP_STATUS_META, formatDateRange } from '../utils/trip-ui'

const props = defineProps<{
  trip: Trip
}>()

const emit = defineEmits<{
  edit: []
}>()

const store = useTravelStore()
const toast = useAppToast()

const statusOptions = [
  { label: 'Планується', value: 'planned' },
  { label: 'Активна', value: 'active' },
  { label: 'Завершена', value: 'completed' }
]

const status = computed({
  get: () => props.trip.status,
  set: (value: TripStatus) => {
    store.updateTrip(props.trip.id, { status: value })
    toast.success('Статус оновлено', TRIP_STATUS_META[value].label)
  }
})

const meta = computed(() => TRIP_STATUS_META[props.trip.status])
</script>

<template>
  <UCard
    class="relative overflow-hidden"
    :ui="{ body: 'p-0 sm:p-0' }"
  >
    <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
    <div class="absolute left-0 top-0 h-full w-1.5" :class="meta.stripe" />

    <div class="relative space-y-5 p-6">
      <UBreadcrumb
        :items="[
          { label: 'Головна', to: '/', icon: 'i-lucide-home' },
          { label: trip.name }
        ]"
      />

      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-3xl leading-none" aria-hidden="true">{{ countryFlag(trip.country) }}</span>
            <h1 class="text-2xl font-bold tracking-tight">
              {{ trip.name }}
            </h1>
            <UBadge :color="meta.color" variant="subtle" size="lg">
              <UIcon :name="meta.icon" class="size-3.5" />
              {{ meta.label }}
            </UBadge>
          </div>
          <p class="text-muted">
            {{ trip.country }} · {{ formatDateRange(trip.startDate, trip.endDate, 'long') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <USelect
            v-model="status"
            :items="statusOptions"
            class="min-w-40"
            size="md"
          />
          <UButton
            label="Редагувати"
            icon="i-lucide-pencil"
            color="neutral"
            variant="outline"
            @click="emit('edit')"
          />
        </div>
      </div>

      <TripProgressBars :trip="trip" />
    </div>
  </UCard>
</template>
