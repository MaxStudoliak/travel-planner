import type { ChecklistCategory } from '../types/travel'

export const CHECKLIST_CATEGORY_LABELS: Record<ChecklistCategory, string> = {
  clothing: 'Одяг',
  documents: 'Документи',
  tech: 'Техніка',
  other: 'Інше'
}

export const CHECKLIST_CATEGORY_ICONS: Record<ChecklistCategory, string> = {
  clothing: 'i-lucide-shirt',
  documents: 'i-lucide-file-text',
  tech: 'i-lucide-smartphone',
  other: 'i-lucide-package'
}

export const DEFAULT_CHECKLIST_TEMPLATES: Record<ChecklistCategory, string[]> = {
  clothing: ['Зручне взуття', 'Куртка', 'Зміна білизни'],
  documents: ['Паспорт', 'Квитки', 'Страховка', 'Готівка / карта'],
  tech: ['Телефон', 'Зарядка', 'Навушники', 'Powerbank'],
  other: ['Аптечка', 'Сонцезахисний крем']
}
