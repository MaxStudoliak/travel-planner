export type TripStatus = 'planned' | 'active' | 'completed'

export type ChecklistCategory = 'clothing' | 'documents' | 'tech' | 'other'

export interface Place {
  id: string
  name: string
  visited: boolean
}

export interface ChecklistItem {
  id: string
  text: string
  category: ChecklistCategory
  packed: boolean
}

export interface Trip {
  id: string
  name: string
  country: string
  startDate: string
  endDate: string
  status: TripStatus
  places: Place[]
  checklist: ChecklistItem[]
}

export interface TravelState {
  trips: Trip[]
}
