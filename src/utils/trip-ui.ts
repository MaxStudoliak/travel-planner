import type { Trip, TripStatus } from '../types/travel'

export const TRIP_STATUS_META: Record<
  TripStatus,
  { label: string, color: 'info' | 'success' | 'neutral', stripe: string, icon: string }
> = {
  planned: {
    label: 'Планується',
    color: 'info',
    stripe: 'bg-info',
    icon: 'i-lucide-calendar-clock'
  },
  active: {
    label: 'Активна',
    color: 'success',
    stripe: 'bg-success',
    icon: 'i-lucide-plane-takeoff'
  },
  completed: {
    label: 'Завершена',
    color: 'neutral',
    stripe: 'bg-neutral-400 dark:bg-neutral-500',
    icon: 'i-lucide-badge-check'
  }
}

export function tripPlacesProgress(trip: Trip) {
  const total = trip.places.length
  const done = trip.places.filter(p => p.visited).length
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
}

export function tripChecklistProgress(trip: Trip) {
  const total = trip.checklist.length
  const done = trip.checklist.filter(i => i.packed).length
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
}

export function formatDateRange(start: string, end: string, style: 'short' | 'long' = 'short') {
  const options: Intl.DateTimeFormatOptions = style === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'short', year: 'numeric' }
  const formatter = new Intl.DateTimeFormat('uk-UA', options)
  return `${formatter.format(new Date(start))} — ${formatter.format(new Date(end))}`
}
