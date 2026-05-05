<script setup>
import LandingView from './LandingView.vue'
import PurposeView from './PurposeView.vue'
import ThemeView from './ThemeView.vue'
import { useSheetStore } from '@/stores/googleSheets'
import NarativeView from './NarativeView.vue'
import UpcomingEvents from '@/components/UpcomingEvents.vue'
import { computed } from 'vue'

const store = useSheetStore()
const pages = computed(() => store.dataFromSheetUrl.pages || [])
const themes = computed(() => store.dataFromSheetUrl.themes || [])
const isPagesLoading = computed(() => store.isSheetLoading('pages'))
const pagesError = computed(() => store.getSheetError('pages'))
const isThemesLoading = computed(() => store.isSheetLoading('themes'))
const themesError = computed(() => store.getSheetError('themes'))
const isEventsLoading = computed(() => store.isSheetLoading('upcoming_event'))
const eventsError = computed(() => store.getSheetError('upcoming_event'))

// --- Event date parsing ----------------------------------------------------
// The "timing" cell in the upcoming_event sheet is freeform text such as
//   "5, June 2025, 4PM"   or   "8TH-10TH JUNE 2025"
// so we extract a year, month, and day with a tolerant heuristic. If the
// cell can't be parsed, we leave the row in "Upcoming" (safer default — we
// won't accidentally bury an event the editor cares about).
const MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
}

const parseEventEndDate = (raw) => {
  if (!raw) return null
  const text = String(raw).toLowerCase()

  const yearMatch = text.match(/(20\d{2}|19\d{2})/)
  if (!yearMatch) return null
  const year = Number(yearMatch[0])

  let month = null
  for (const name of Object.keys(MONTHS)) {
    if (new RegExp(`\\b${name}\\b`).test(text)) {
      month = MONTHS[name]
      break
    }
  }
  if (month === null) return null

  // Strip times ("4PM", "10:30am") and ordinal suffixes ("8TH" → "8") so the
  // day-of-month numbers we collect aren't polluted.
  const cleaned = text
    .replace(/\b\d{1,2}(:\d{2})?\s*(am|pm)\b/gi, '')
    .replace(/(\d+)(st|nd|rd|th)/gi, '$1')

  const days = (cleaned.match(/\b\d{1,2}\b/g) || [])
    .map(Number)
    .filter((n) => n >= 1 && n <= 31)
  // For ranges ("8-10 June") use the latest day so multi-day events stay in
  // "Upcoming" until the final day passes.
  const day = days.length ? Math.max(...days) : 1

  return new Date(year, month, day)
}

// Optional explicit override on the sheet via a `status` column.
const PAST_STATUSES = new Set(['past', 'done', 'completed', 'archived', 'archive'])
const UPCOMING_STATUSES = new Set(['upcoming', 'future', 'scheduled'])

const isPastEvent = (row) => {
  const status = String(row?.status || '').trim().toLowerCase()
  if (PAST_STATUSES.has(status)) return true
  if (UPCOMING_STATUSES.has(status)) return false

  const dateField =
    row?.timing || row?.date || row?.event_date || row?.when || row?.start_date
  const parsed = parseEventEndDate(dateField)
  if (!parsed) return false

  const endOfDay = new Date(parsed)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay.getTime() < Date.now()
}

const allEvents = computed(() => store.dataFromSheetUrl.upcoming_event || [])
const upcomingEvents = computed(() => allEvents.value.filter((row) => !isPastEvent(row)))
const pastEvents = computed(() => allEvents.value.filter((row) => isPastEvent(row)))

const retryPages = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: ['pages'] })
}

const retryThemes = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: ['themes'] })
}

const retryEvents = async () => {
  await store.fetchSheetData({ force: true, sheetKeys: ['upcoming_event'] })
}
</script>

<template>
  <main>
    <LandingView
      :pages="pages"
      :is-loading="isPagesLoading"
      :error-message="pagesError"
      @retry="retryPages"
    />
    <PurposeView
      :pages="pages"
      :is-loading="isPagesLoading"
      :error-message="pagesError"
      @retry="retryPages"
    />
    <ThemeView
      :themes="themes"
      :is-loading="isThemesLoading"
      :error-message="themesError"
      @retry="retryThemes"
    />
    <NarativeView
      :pages="pages"
      :is-loading="isPagesLoading"
      :error-message="pagesError"
      @retry="retryPages"
    />
    <UpcomingEvents
      :events="upcomingEvents"
      :is-loading="isEventsLoading"
      :error-message="eventsError"
      title="Upcoming Events"
      eyebrow="What's next"
      variant="upcoming"
      empty-message="No upcoming events at the moment — check back soon."
      @retry="retryEvents"
    />
    <UpcomingEvents
      :events="pastEvents"
      :is-loading="false"
      error-message=""
      title="Past Events"
      eyebrow="Looking back"
      variant="past"
      hide-when-empty
    />
  </main>
</template>
