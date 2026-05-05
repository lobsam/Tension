<template>
  <section
    v-if="!hideSection"
    class="events-section container-fluid px-4 px-sm-5 py-5"
    :class="`events-section--${variant}`"
    :aria-labelledby="headingId"
  >
    <div class="events-section__inner">
      <div class="events-section__header">
        <span class="events-section__eyebrow text-uppercase">{{ eyebrow }}</span>
        <h2 :id="headingId" class="events-section__title text-uppercase">
          {{ title }}
        </h2>
      </div>

      <div v-if="showStatusNote" class="events-section__status" role="status" aria-live="polite">
        <p class="mb-0">{{ statusMessage }}</p>
        <button
          v-if="props.errorMessage"
          type="button"
          class="events-section__retry"
          @click="emit('retry')"
        >
          Retry events
        </button>
      </div>

      <ul v-else class="events-section__list" role="list">
        <li
          v-for="(event, i) in normalizedEvents"
          :key="event.id || i"
          class="events-section__card"
        >
          <div v-if="event.imageUrl" class="events-section__media">
            <img :src="event.imageUrl" :alt="event.title" loading="lazy" />
          </div>
          <div class="events-section__card-body">
            <div class="events-section__meta-row">
              <span v-if="event.place" class="events-section__place text-uppercase">
                {{ event.place }}
              </span>
              <span v-if="event.date" class="events-section__date text-uppercase">
                {{ event.date }}
              </span>
            </div>
            <h3 class="events-section__card-title">{{ event.title }}</h3>
            <p v-if="event.address" class="events-section__card-address">
              <img
                src="/icons/location.svg"
                alt=""
                class="events-section__icon"
                aria-hidden="true"
              />
              <span>{{ event.address }}</span>
            </p>
            <p v-if="event.description" class="events-section__card-desc">
              {{ event.description }}
            </p>
            <a
              v-if="event.link"
              :href="event.link"
              class="events-section__card-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more &rsaquo;
            </a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['retry'])

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Upcoming Events'
  },
  eyebrow: {
    type: String,
    default: "What's next"
  },
  // 'upcoming' | 'past' — controls accent color and image treatment.
  variant: {
    type: String,
    default: 'upcoming'
  },
  // When true, the section renders nothing if there are no events to show
  // (and we're not loading or in an error state). Useful for the past-events
  // section so we don't show an empty block when nothing has happened yet.
  hideWhenEmpty: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No upcoming events at the moment — check back soon.'
  }
})

const headingId = computed(() => `events-section-${props.variant}-heading`)

// Column names in the sheet aren't fixed, so accept a handful of common aliases.
const pickField = (row, keys) => {
  for (const key of keys) {
    const value = row?.[key]
    if (value != null && String(value).trim() !== '') {
      return String(value).replace(/\s+/g, ' ').trim()
    }
  }
  return ''
}

const normalizedEvents = computed(() => {
  const rows = Array.isArray(props.events) ? props.events : []

  return rows
    .map((row, i) => ({
      id: pickField(row, ['id']) || `event-${i}`,
      title: pickField(row, ['title', 'name', 'event', 'event_name']),
      date: pickField(row, ['timing', 'date', 'event_date', 'when', 'start_date']),
      place: pickField(row, ['place', 'city', 'region']),
      address: pickField(row, ['address', 'venue', 'location']),
      description: pickField(row, ['description', 'details', 'summary', 'body']),
      link: pickField(row, ['link', 'url', 'rsvp', 'register']),
      imageUrl: pickField(row, ['image_url', 'image', 'photo', 'thumbnail', 'imageUrl'])
    }))
    .filter((event) => event.title)
})

const hasEvents = computed(() => normalizedEvents.value.length > 0)

const showStatusNote = computed(
  () => !hasEvents.value && (props.isLoading || props.errorMessage || !props.hideWhenEmpty)
)

const hideSection = computed(
  () => !hasEvents.value && props.hideWhenEmpty && !props.isLoading && !props.errorMessage
)

const statusMessage = computed(() => {
  if (props.isLoading) {
    return 'Loading events...'
  }

  if (props.errorMessage) {
    return props.errorMessage
  }

  return props.emptyMessage
})
</script>

<style scoped>
.events-section {
  background: #0d0d0d;
  color: white;
  font-family: 'Source Sans Pro', sans-serif;
}

.events-section__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.events-section__header {
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 1rem;
}

.events-section__eyebrow {
  display: inline-block;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  color: var(--events-accent, #ffd447);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.events-section__title {
  margin: 0;
  font-size: clamp(1.75rem, 3vw + 0.75rem, 3rem);
  font-weight: 900;
  letter-spacing: 0.02em;
  line-height: 1;
}

.events-section__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.events-section__card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-left: 3px solid var(--events-accent, #ffd447);
  overflow: hidden;
  transition: background 0.2s ease, transform 0.2s ease;
}

.events-section__card:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateY(-2px);
}

.events-section__media {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}

.events-section__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.events-section__card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem 1.5rem;
}

.events-section__meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.85rem;
  margin-bottom: 0.1rem;
}

.events-section__place {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #0d0d0d;
  background: var(--events-accent, #ffd447);
  padding: 0.2rem 0.55rem;
  line-height: 1.3;
}

.events-section__date {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--events-accent, #ffd447);
}

.events-section__card-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.25;
}

.events-section__card-address {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.85;
}

.events-section__icon {
  width: 1rem;
  height: 1rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
  filter: invert(1);
}

.events-section__card-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.9;
}

.events-section__card-link {
  align-self: flex-start;
  margin-top: 0.25rem;
  color: var(--events-accent, #ffd447);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  transition: color 0.15s ease, transform 0.15s ease;
}

.events-section__card-link:hover,
.events-section__card-link:focus-visible {
  color: var(--events-accent-hover, #ffe27a);
  transform: translateX(2px);
}

.events-section__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.95rem;
}

.events-section__retry {
  border: 1px solid var(--events-accent, #ffd447);
  background: transparent;
  color: var(--events-accent, #ffd447);
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: background 0.15s ease, color 0.15s ease;
}

.events-section__retry:hover,
.events-section__retry:focus-visible {
  background: var(--events-accent, #ffd447);
  color: #0d0d0d;
}

/* Past-events styling: muted accent + slightly desaturated images so the
   "Upcoming" section visually wins. */
.events-section--past {
  --events-accent: #b9b9b9;
  --events-accent-hover: #ffffff;
  background: #161616;
}

.events-section--past .events-section__media img {
  filter: grayscale(40%);
  opacity: 0.85;
}

@media (min-width: 768px) {
  .events-section__list {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }
}
</style>
