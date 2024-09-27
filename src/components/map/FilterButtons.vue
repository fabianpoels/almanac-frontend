<template>
  <q-btn color="secondary" rounded :label="timeFilterLabel" class="q-ml-md">
    <q-menu v-model="showDateFilter" @before-show="show" :persistent="loading" fit>
      <q-list separator>
        <q-item v-for="opt in presets" :key="opt">
          <q-item-section>
            <q-radio v-model="span" :val="opt" :label="$t(`filter.${opt}`)" :key="opt" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-radio v-model="span" val="custom" :label="$t('filter.custom')" />
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
        <q-separator />
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
    :disable="newsStore.activeCategories.length < 1"
    color="secondary"
    rounded
    label="categories"
    class="q-ml-md"
  >
    <q-badge v-if="showCategoryWarning" color="red" floating> ! </q-badge>
    <q-menu fit>
      <q-option-group
        v-model="newsStore.categoryFilter"
        :options="categoryOptions"
        type="checkbox"
      />
    </q-menu>
  </q-btn>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()

import { dt } from '@/utils'

const timeFilterLabel = computed(() => {
  if (newsStore.timespan === 'custom') {
    return `${newsStore.customRange.from} - ${newsStore.customRange.to}`
  }
  return t(`filter.${newsStore.timespan}`)
})

const showCategoryWarning = computed(() => {
  return newsStore.categoryFilter.length < newsStore.categoryOptions.length
})

const presets = ['12hr', '24hr', '48hr', 'week', 'month']
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

const categoryOptions = computed(() => {
  return newsStore.categoryOptions.filter((opt) => newsStore.activeCategories.includes(opt.value))
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
</script>
