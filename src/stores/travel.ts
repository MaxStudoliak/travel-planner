import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { DEFAULT_CHECKLIST_TEMPLATES } from '../data/checklist-templates'
import type {
  ChecklistCategory,
  ChecklistItem,
  TravelState,
  Trip,
  TripStatus
} from '../types/travel'

const STORAGE_KEY = 'travel-planner-state'

function createId(): string {
  return crypto.randomUUID()
}

function loadState(): TravelState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { trips: [] }
    const parsed = JSON.parse(raw) as TravelState
    return Array.isArray(parsed.trips) ? parsed : { trips: [] }
  } catch {
    return { trips: [] }
  }
}

function buildDefaultChecklist(): ChecklistItem[] {
  return (Object.entries(DEFAULT_CHECKLIST_TEMPLATES) as [ChecklistCategory, string[]][])
    .flatMap(([category, items]) =>
      items.map(text => ({
        id: createId(),
        text,
        category,
        packed: false
      }))
    )
}

export const useTravelStore = defineStore('travel', () => {
  const trips = ref<Trip[]>(loadState().trips)

  watch(
    trips,
    value => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ trips: value }))
    },
    { deep: true }
  )

  const completedTrips = computed(() =>
    trips.value.filter(trip => trip.status === 'completed')
  )

  const stats = computed(() => {
    const countries = new Set(
      completedTrips.value.map(trip => trip.country.trim().toLowerCase()).filter(Boolean)
    )
    const visitedPlaces = trips.value.reduce(
      (sum, trip) => sum + trip.places.filter(place => place.visited).length,
      0
    )
    const totalPlaces = trips.value.reduce((sum, trip) => sum + trip.places.length, 0)

    return {
      countriesCount: countries.size,
      visitedPlaces,
      totalPlaces,
      tripsCount: trips.value.length,
      activeTrips: trips.value.filter(trip => trip.status === 'active').length
    }
  })

  function getTripById(id: string): Trip | undefined {
    return trips.value.find(trip => trip.id === id)
  }

  function addTrip(payload: {
    name: string
    country: string
    startDate: string
    endDate: string
    status: TripStatus
    withDefaultChecklist?: boolean
  }): string {
    const id = createId()
    trips.value.unshift({
      id,
      name: payload.name.trim(),
      country: payload.country.trim(),
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: payload.status,
      places: [],
      checklist: payload.withDefaultChecklist === false ? [] : buildDefaultChecklist()
    })
    return id
  }

  function updateTrip(id: string, payload: Partial<Omit<Trip, 'id' | 'places' | 'checklist'>>) {
    const trip = getTripById(id)
    if (!trip) return
    Object.assign(trip, payload)
  }

  function deleteTrip(id: string) {
    trips.value = trips.value.filter(trip => trip.id !== id)
  }

  function addPlace(tripId: string, name: string) {
    const trip = getTripById(tripId)
    if (!trip || !name.trim()) return
    trip.places.push({ id: createId(), name: name.trim(), visited: false })
  }

  function togglePlaceVisited(tripId: string, placeId: string) {
    const place = getTripById(tripId)?.places.find(item => item.id === placeId)
    if (place) place.visited = !place.visited
  }

  function removePlace(tripId: string, placeId: string) {
    const trip = getTripById(tripId)
    if (!trip) return
    trip.places = trip.places.filter(place => place.id !== placeId)
  }

  function addChecklistItem(tripId: string, text: string, category: ChecklistCategory) {
    const trip = getTripById(tripId)
    if (!trip || !text.trim()) return
    trip.checklist.push({
      id: createId(),
      text: text.trim(),
      category,
      packed: false
    })
  }

  function toggleChecklistPacked(tripId: string, itemId: string) {
    const item = getTripById(tripId)?.checklist.find(entry => entry.id === itemId)
    if (item) item.packed = !item.packed
  }

  function removeChecklistItem(tripId: string, itemId: string) {
    const trip = getTripById(tripId)
    if (!trip) return
    trip.checklist = trip.checklist.filter(item => item.id !== itemId)
  }

  function applyChecklistTemplate(tripId: string) {
    const trip = getTripById(tripId)
    if (!trip) return
    trip.checklist = buildDefaultChecklist()
  }

  return {
    trips,
    stats,
    getTripById,
    addTrip,
    updateTrip,
    deleteTrip,
    addPlace,
    togglePlaceVisited,
    removePlace,
    addChecklistItem,
    toggleChecklistPacked,
    removeChecklistItem,
    applyChecklistTemplate
  }
})
