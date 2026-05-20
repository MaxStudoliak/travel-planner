<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTravelStore } from '../stores/travel'

const store = useTravelStore()
const { stats } = storeToRefs(store)

const items = [
  { label: 'Подорожей', value: () => stats.value.tripsCount, icon: 'i-lucide-plane', tint: 'from-sky-500/20 to-sky-500/5' },
  { label: 'Активних', value: () => stats.value.activeTrips, icon: 'i-lucide-map-pin', tint: 'from-emerald-500/20 to-emerald-500/5' },
  { label: 'Країн відвідано', value: () => stats.value.countriesCount, icon: 'i-lucide-globe', tint: 'from-violet-500/20 to-violet-500/5' },
  { label: 'Місць відвідано', value: () => stats.value.visitedPlaces, icon: 'i-lucide-check-circle', tint: 'from-amber-500/20 to-amber-500/5' }
]
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <UCard
      v-for="item in items"
      :key="item.label"
      variant="subtle"
      class="relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br opacity-80"
        :class="item.tint"
      />
      <div class="relative flex items-center gap-3">
        <div class="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
          <UIcon :name="item.icon" class="size-5" />
        </div>
        <div>
          <p class="text-2xl font-bold tabular-nums">
            <AnimatedNumber :value="item.value()" />
          </p>
          <p class="text-sm text-muted">
            {{ item.label }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
