<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Trip, TripStatus } from '../types/travel'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  trip?: Trip
}>()

const emit = defineEmits<{
  save: [payload: {
    name: string
    country: string
    startDate: string
    endDate: string
    status: TripStatus
    withDefaultChecklist?: boolean
  }]
}>()

const statusOptions = [
  { label: 'Планується', value: 'planned' },
  { label: 'Активна', value: 'active' },
  { label: 'Завершена', value: 'completed' }
]

const form = reactive({
  name: '',
  country: '',
  startDate: '',
  endDate: '',
  status: 'planned' as TripStatus,
  withDefaultChecklist: true
})

const error = ref('')

watch(open, value => {
  if (!value) return
  error.value = ''
  if (props.trip) {
    form.name = props.trip.name
    form.country = props.trip.country
    form.startDate = props.trip.startDate
    form.endDate = props.trip.endDate
    form.status = props.trip.status
    form.withDefaultChecklist = false
  } else {
    form.name = ''
    form.country = ''
    form.startDate = ''
    form.endDate = ''
    form.status = 'planned'
    form.withDefaultChecklist = true
  }
})

function submit() {
  if (!form.name.trim() || !form.country.trim()) {
    error.value = 'Заповніть назву та країну'
    return
  }
  if (!form.startDate || !form.endDate) {
    error.value = 'Вкажіть дати поїздки'
    return
  }
  if (form.endDate < form.startDate) {
    error.value = 'Дата завершення не може бути раніше початку'
    return
  }

  emit('save', { ...form })
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" :title="trip ? 'Редагувати подорож' : 'Нова подорож'">
    <template #body>
      <form class="space-y-4" @submit.prevent="submit">
        <UFormField label="Назва поїздки" required>
          <UInput v-model="form.name" placeholder="Наприклад, Весняний Париж" />
        </UFormField>

        <UFormField label="Країна" required>
          <UInput v-model="form.country" placeholder="Франція" />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Початок" required>
            <UInput v-model="form.startDate" type="date" />
          </UFormField>
          <UFormField label="Кінець" required>
            <UInput v-model="form.endDate" type="date" />
          </UFormField>
        </div>

        <UFormField label="Статус">
          <USelect v-model="form.status" :items="statusOptions" />
        </UFormField>

        <UCheckbox
          v-if="!trip"
          v-model="form.withDefaultChecklist"
          label="Додати шаблонний чекліст (одяг, документи, техніка)"
        />

        <p v-if="error" class="text-sm text-error">
          {{ error }}
        </p>
      </form>
    </template>

    <template #footer>
      <UButton label="Скасувати" color="neutral" variant="outline" @click="open = false" />
      <UButton :label="trip ? 'Зберегти' : 'Створити'" @click="submit" />
    </template>
  </UModal>
</template>
