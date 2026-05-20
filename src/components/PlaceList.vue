<script setup lang="ts">
import { ref } from 'vue'
import { useAppToast } from '../composables/useAppToast'
import { useTravelStore } from '../stores/travel'

const props = defineProps<{
  tripId: string
}>()

const store = useTravelStore()
const toast = useAppToast()
const newPlace = ref('')

function addPlace() {
  const name = newPlace.value.trim()
  if (!name) return
  store.addPlace(props.tripId, name)
  newPlace.value = ''
  toast.success('Місце додано', name)
}

function toggleVisited(placeId: string, placeName: string, visited: boolean) {
  store.togglePlaceVisited(props.tripId, placeId)
  if (!visited) {
    toast.success('Відвідано!', placeName)
  }
}

function removePlace(placeName: string, placeId: string) {
  store.removePlace(props.tripId, placeId)
  toast.info('Місце видалено', placeName)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <div class="flex size-9 items-center justify-center rounded-lg bg-info/15 text-info">
          <UIcon name="i-lucide-map-pin" class="size-4" />
        </div>
        <div>
          <h3 class="font-semibold">
            Місця для відвідування
          </h3>
          <p class="text-sm text-muted">
            Відмічайте після відвідування
          </p>
        </div>
      </div>
    </template>

    <form class="mb-4 flex gap-2" @submit.prevent="addPlace">
      <UInput v-model="newPlace" class="flex-1" placeholder="Наприклад, Лувр" />
      <UButton type="submit" label="Додати" icon="i-lucide-plus" :disabled="!newPlace.trim()" />
    </form>

    <ul v-if="store.getTripById(tripId)?.places.length" class="space-y-2">
      <li
        v-for="place in store.getTripById(tripId)?.places"
        :key="place.id"
        class="flex items-center justify-between gap-3 rounded-lg border border-default px-3 py-2 transition hover:bg-elevated/50"
      >
        <label class="flex flex-1 cursor-pointer items-center gap-3">
          <UCheckbox
            :model-value="place.visited"
            @update:model-value="toggleVisited(place.id, place.name, place.visited)"
          />
          <span :class="place.visited ? 'text-muted line-through' : ''">{{ place.name }}</span>
        </label>
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          aria-label="Видалити"
          @click="removePlace(place.name, place.id)"
        />
      </li>
    </ul>

    <p v-else class="text-sm text-muted">
      Поки немає місць. Додайте перше місце вище.
    </p>
  </UCard>
</template>
