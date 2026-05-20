<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppToast } from '../../composables/useAppToast'
import { useTravelStore } from '../../stores/travel'

const route = useRoute()
const store = useTravelStore()
const toast = useAppToast()
const showForm = ref(false)

const tripId = computed(() => String(route.params.id ?? ''))
const trip = computed(() => store.getTripById(tripId.value))

function onSave(payload: Parameters<typeof store.updateTrip>[1]) {
  if (!trip.value) return
  store.updateTrip(trip.value.id, payload)
  toast.success('Подорож оновлено', payload.name)
}
</script>

<template>
  <UContainer v-if="trip" class="space-y-8 py-8">
    <TripHeaderCard :trip="trip" @edit="showForm = true" />

    <div class="grid gap-6 lg:grid-cols-2">
      <PlaceList :trip-id="trip.id" />
      <ChecklistPanel :trip-id="trip.id" />
    </div>

    <TripFormModal v-model:open="showForm" :trip="trip" @save="onSave" />
  </UContainer>

  <UContainer v-else class="py-16">
    <div class="rounded-2xl border border-dashed border-default bg-elevated/30 px-6 py-12">
      <UEmpty
        icon="i-lucide-map-pin-off"
        title="Подорож не знайдена"
        description="Можливо, її було видалено."
        :actions="[{
          label: 'На головну',
          to: '/',
          icon: 'i-lucide-home'
        }]"
      />
    </div>
  </UContainer>
</template>
