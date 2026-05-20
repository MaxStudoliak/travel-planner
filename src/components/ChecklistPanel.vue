<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppToast } from '../composables/useAppToast'
import { CHECKLIST_CATEGORY_ICONS, CHECKLIST_CATEGORY_LABELS } from '../data/checklist-templates'
import { useTravelStore } from '../stores/travel'
import type { ChecklistCategory } from '../types/travel'

const props = defineProps<{
  tripId: string
}>()

const store = useTravelStore()
const toast = useAppToast()
const newItemText = ref('')
const newItemCategory = ref<ChecklistCategory>('other')

const categoryOptions = Object.entries(CHECKLIST_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label
}))

const groupedChecklist = computed(() => {
  const trip = store.getTripById(props.tripId)
  if (!trip) return []

  return (Object.keys(CHECKLIST_CATEGORY_LABELS) as ChecklistCategory[]).map(category => ({
    category,
    label: CHECKLIST_CATEGORY_LABELS[category],
    icon: CHECKLIST_CATEGORY_ICONS[category],
    items: trip.checklist.filter(item => item.category === category)
  })).filter(group => group.items.length > 0)
})

function addItem() {
  const text = newItemText.value.trim()
  if (!text) return
  store.addChecklistItem(props.tripId, text, newItemCategory.value)
  newItemText.value = ''
  toast.success('Додано до чеклісту', text)
}

function applyTemplate() {
  store.applyChecklistTemplate(props.tripId)
  toast.info('Шаблон застосовано', 'Одяг, документи, техніка')
}

function togglePacked(itemId: string, text: string, packed: boolean) {
  store.toggleChecklistPacked(props.tripId, itemId)
  if (!packed) {
    toast.success('У валізі', text)
  }
}

function removeItem(text: string, itemId: string) {
  store.removeChecklistItem(props.tripId, itemId)
  toast.info('Прибрано з чеклісту', text)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <div class="flex size-9 items-center justify-center rounded-lg bg-success/15 text-success">
            <UIcon name="i-lucide-luggage" class="size-4" />
          </div>
          <div>
            <h3 class="font-semibold">
              Чекліст речей
            </h3>
            <p class="text-sm text-muted">
              Одяг · документи · техніка
            </p>
          </div>
        </div>
        <UButton
          label="Шаблон"
          icon="i-lucide-list-restart"
          color="neutral"
          variant="outline"
          size="sm"
          @click="applyTemplate"
        />
      </div>
    </template>

    <form class="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]" @submit.prevent="addItem">
      <UInput v-model="newItemText" placeholder="Що взяти з собою?" />
      <USelect v-model="newItemCategory" :items="categoryOptions" class="min-w-36" />
      <UButton type="submit" label="Додати" icon="i-lucide-plus" :disabled="!newItemText.trim()" />
    </form>

    <div v-if="groupedChecklist.length" class="space-y-5">
      <section v-for="group in groupedChecklist" :key="group.category">
        <h4 class="mb-2 flex items-center gap-2 text-sm font-medium">
          <UIcon :name="group.icon" class="size-4 text-primary" />
          {{ group.label }}
        </h4>
        <ul class="space-y-2">
          <li
            v-for="item in group.items"
            :key="item.id"
            class="flex items-center justify-between gap-3 rounded-lg border border-default px-3 py-2 transition hover:bg-elevated/50"
          >
            <label class="flex flex-1 cursor-pointer items-center gap-3">
              <UCheckbox
                :model-value="item.packed"
                @update:model-value="togglePacked(item.id, item.text, item.packed)"
              />
              <span :class="item.packed ? 'text-muted line-through' : ''">{{ item.text }}</span>
            </label>
            <UButton
              icon="i-lucide-trash-2"
              color="neutral"
              variant="ghost"
              aria-label="Видалити"
              @click="removeItem(item.text, item.id)"
            />
          </li>
        </ul>
      </section>
    </div>

    <p v-else class="text-sm text-muted">
      Чекліст порожній. Додайте речі або натисніть «Шаблон».
    </p>
  </UCard>
</template>
