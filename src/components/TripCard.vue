<script setup lang="ts">
import type { Trip } from '../types/travel'
import { countryFlag } from '../utils/country'
import { TRIP_STATUS_META, formatDateRange } from '../utils/trip-ui'

defineProps<{
  trip: Trip
}>()
</script>

<template>
  <UCard class="group relative overflow-hidden transition hover:shadow-md hover:ring-1 hover:ring-primary/25">
    <div
      class="absolute left-0 top-0 h-full w-1.5 transition-all group-hover:w-2"
      :class="TRIP_STATUS_META[trip.status].stripe"
    />

    <div class="flex flex-col gap-4 pl-2 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 flex-1 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-2xl leading-none" aria-hidden="true">{{ countryFlag(trip.country) }}</span>
          <h3 class="text-lg font-semibold tracking-tight">
            {{ trip.name }}
          </h3>
          <UBadge :color="TRIP_STATUS_META[trip.status].color" variant="subtle">
            <UIcon :name="TRIP_STATUS_META[trip.status].icon" class="size-3" />
            {{ TRIP_STATUS_META[trip.status].label }}
          </UBadge>
        </div>
        <p class="text-sm text-muted">
          {{ trip.country }} · {{ formatDateRange(trip.startDate, trip.endDate) }}
        </p>
        <TripProgressBars :trip="trip" compact />
      </div>

      <div class="flex shrink-0 gap-2 sm:flex-col sm:items-end">
        <UButton
          :to="`/trips/${trip.id}`"
          label="Відкрити"
          icon="i-lucide-arrow-right"
          trailing
        />
        <div class="flex gap-1">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </UCard>
</template>
