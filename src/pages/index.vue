<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppToast } from '../composables/useAppToast';
import { useTravelStore } from '../stores/travel';
import type { Trip, TripStatus } from '../types/travel';

const router = useRouter();
const store = useTravelStore();
const toast = useAppToast();
const showForm = ref(false);
const editingTrip = ref<Trip>();
const deleteTarget = ref<Trip>();
const statusFilter = ref<'all' | TripStatus>('all');

const filterTabs = computed(() => [
    { label: 'Усі', value: 'all', badge: store.trips.length || undefined },
    {
        label: 'Планується',
        value: 'planned',
        badge: store.trips.filter(t => t.status === 'planned').length || undefined,
    },
    { label: 'Активна', value: 'active', badge: store.trips.filter(t => t.status === 'active').length || undefined },
    {
        label: 'Завершена',
        value: 'completed',
        badge: store.trips.filter(t => t.status === 'completed').length || undefined,
    },
]);

const filteredTrips = computed(() => {
    if (statusFilter.value === 'all') return store.trips;
    return store.trips.filter(trip => trip.status === statusFilter.value);
});

function openCreate() {
    editingTrip.value = undefined;
    showForm.value = true;
}

function openEdit(trip: Trip) {
    editingTrip.value = trip;
    showForm.value = true;
}

function onSave(payload: Parameters<typeof store.addTrip>[0]) {
    if (editingTrip.value) {
        store.updateTrip(editingTrip.value.id, payload);
        toast.success('Подорож оновлено', payload.name);
        return;
    }
    const id = store.addTrip(payload);
    toast.success('Подорож створено', payload.name);
    router.push(`/trips/${id}`);
}

function confirmDelete() {
    if (!deleteTarget.value) return;
    const name = deleteTarget.value.name;
    store.deleteTrip(deleteTarget.value.id);
    deleteTarget.value = undefined;
    toast.info('Подорож видалено', name);
}
</script>

<template>
    <UContainer class="space-y-8 py-8">
        <section
            class="relative overflow-hidden rounded-2xl border border-default bg-gradient-to-br from-primary/15 via-transparent to-info/10 px-1 pb-1 pt-1"
        >
            <div class="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-primary/10 blur-3xl" />
            <div class="pointer-events-none absolute -bottom-12 -left-8 size-32 rounded-full bg-info/10 blur-2xl" />
            <UPageHero
                class="relative"
                title="Планувальник подорожей"
                description="Керуйте поїздками, місцями та чеклістом."
                :links="[
                    {
                        label: 'Нова подорож',
                        icon: 'i-lucide-plus',
                        size: 'lg',
                        onClick: openCreate,
                    },
                ]"
                :ui="{
                    header: 'flex flex-col items-center',
                    headline: 'justify-center',
                    title: 'text-3xl sm:text-4xl font-bold tracking-tight text-center',
                    description: 'text-base text-muted max-w-2xl mx-auto text-center text-balance',
                }"
            >
                <template #headline>
                    <div
                        class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                        <UIcon name="i-lucide-plane" class="size-4" />
                        Vue 3 · Pinia · localStorage
                    </div>
                </template>
            </UPageHero>
        </section>

        <section class="space-y-4">
            <div class="flex items-center gap-2">
                <UIcon name="i-lucide-bar-chart-3" class="size-5 text-primary" />
                <h2 class="text-xl font-semibold">Статистика</h2>
            </div>
            <StatsOverview />
            <p class="text-sm text-muted">Країни — з завершених подорожей. Місця — усі відмічені як «відвідано».</p>
        </section>

        <section class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-backpack" class="size-5 text-primary" />
                    <h2 class="text-xl font-semibold">Мої подорожі</h2>
                </div>
                <UButton label="Додати подорож" icon="i-lucide-plus" @click="openCreate" />
            </div>

            <UTabs
                v-if="store.trips.length"
                v-model="statusFilter"
                :items="filterTabs"
                :content="false"
                variant="pill"
                class="w-full"
            />

            <div v-if="filteredTrips.length" class="space-y-4">
                <TripCard v-for="trip in filteredTrips" :key="trip.id" :trip="trip">
                    <template #actions>
                        <UButton
                            icon="i-lucide-pencil"
                            color="neutral"
                            variant="ghost"
                            aria-label="Редагувати"
                            @click="openEdit(trip)"
                        />
                        <UButton
                            icon="i-lucide-trash-2"
                            color="error"
                            variant="ghost"
                            aria-label="Видалити"
                            @click="deleteTarget = trip"
                        />
                    </template>
                </TripCard>
            </div>

            <UEmpty
                v-else-if="store.trips.length && statusFilter !== 'all'"
                icon="i-lucide-filter-x"
                title="Немає подорожей у цій категорії"
                description="Спробуйте інший фільтр або створіть нову поїздку."
                :actions="[
                    {
                        label: 'Показати всі',
                        onClick: () => {
                            statusFilter = 'all';
                        },
                    },
                ]"
            />

            <div v-else class="rounded-2xl border border-dashed border-default bg-elevated/30 px-6 py-12">
                <UEmpty
                    icon="i-lucide-plane"
                    title="Поки немає подорожей"
                    description="Створіть першу поїздку — додайте місця, зберіть чекліст і відстежуйте прогрес."
                    :actions="[
                        {
                            label: 'Створити подорож',
                            icon: 'i-lucide-plus',
                            size: 'lg',
                            onClick: openCreate,
                        },
                    ]"
                />
            </div>
        </section>

        <TripFormModal v-model:open="showForm" :trip="editingTrip" @save="onSave" />

        <UModal
            :open="!!deleteTarget"
            title="Видалити подорож?"
            :description="deleteTarget ? `«${deleteTarget.name}» буде видалено назавжди.` : ''"
            @update:open="
                (v: boolean) => {
                    if (!v) deleteTarget = undefined;
                }
            "
        >
            <template #footer>
                <UButton label="Скасувати" color="neutral" variant="outline" @click="deleteTarget = undefined" />
                <UButton label="Видалити" color="error" @click="confirmDelete" />
            </template>
        </UModal>
    </UContainer>
</template>
