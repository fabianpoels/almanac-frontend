<template>
  <q-btn color="secondary" rounded icon="schedule" class="q-ml-md">
    <div class="button-text q-ml-sm">
      {{ timeFilterLabel }}
    </div>
    <q-menu
      v-model="showDateFilter"
      @before-show="show"
      :persistent="loading"
      fit
      class="q-py-md q-px-sm"
    >
      <q-list dense>
        <q-item v-for="opt in presets" :key="opt">
          <q-item-section>
            <q-radio v-model="span" :val="opt" :label="$t(`filter.${opt}`)" :key="opt" size="sm" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-radio v-model="span" val="custom" :label="$t('filter.custom')" size="sm" />
            <q-slide-transition>
              <q-date
                minimal
                v-show="span === 'custom'"
                v-model="range"
                range
                :options="validDates"
              />
            </q-slide-transition>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-btn
              color="primary"
              :label="$t('forms.apply')"
              :loading="loading"
              @click="apply()"
              :disable="disableApply"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <q-btn
    :disable="newsStore.activeCategories.length < 2"
    color="secondary"
    rounded
    icon="filter_alt"
    class="q-ml-md"
  >
    <div class="button-text q-ml-sm">
      {{ $t('filter.filters') }}
    </div>
    <q-badge v-if="showFilterWarning" color="primary" floating rounded />
    <q-menu fit class="q-py-md">
      <q-list>
        <q-item>
          <q-item-section>
            <q-toggle v-model="newsStore.showUnread" :label="$t('filter.showReadNews')" />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <filter-toggle
              v-for="categoryOption in categoryOptions"
              :key="categoryOption.value"
              :categoryOption="categoryOption"
              :toggledOn="newsStore.categoryFilter.includes(categoryOption.value)"
              @toggle="(val) => toggle(val, categoryOption.value)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { useApplicationStore } from '@/stores/applicationStore'
const applicationStore = useApplicationStore()
import FilterToggle from '@/components/map/_FilterToggle.vue'

import { dt } from '@/utils'

const timeFilterLabel = computed(() => {
  if (newsStore.timespan === 'custom') {
    return `${newsStore.customRange.from} - ${newsStore.customRange.to}`
  }
  return t(`filter.${newsStore.timespan}`)
})

const showFilterWarning = computed(() => {
  if (!newsStore.showUnread) return true
  return newsStore.categoryFilter.length < newsStore.categoryOptions(t).length
})

const categoryOptions = computed(() => {
  return newsStore
    .categoryOptions(t)
    .filter((opt) => newsStore.activeCategories.includes(opt.value))
})

const presets = ['12hr', '24hr', '48hr', '7days', '30days']
const span = ref('24hr')
const range = ref(null)
const loading = ref(false)
const showDateFilter = ref(false)

const disableApply = computed(() => {
  if (span.value !== newsStore.timespan) return false
  if (span.value === 'custom') {
    if (range.value.from !== newsStore.customRange.from) return false
    if (range.value.to !== newsStore.customRange.to) return false
  }
  return true
})

function show() {
  span.value = newsStore.timespan
  range.value = newsStore.customRange
}

async function apply() {
  loading.value = true
  try {
    newsStore.timespan = span.value
    if (span.value === 'custom') newsStore.customRange = range.value
    await newsStore.fetchNewsItems()
    await applicationStore.loadHasSeen()
    showDateFilter.value = false
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

function validDates(date) {
  return date <= dt.todayAsQuasarDateString()
}

function toggle(val, category) {
  if (val === true && !newsStore.categoryFilter.includes(category)) {
    newsStore.categoryFilter.push(category)
  } else {
    newsStore.categoryFilter = newsStore.categoryFilter.filter((c) => c !== category)
  }
}
</script>
<style scoped>
@media only screen and (max-width: 500px) {
  .button-text {
    display: none;
  }
}
</style>
