<template>
  <q-item @click="onClickItem()" clickable>
    <div v-if="applicationStore.isNew(newsItem)" class="red-dot" />
    <q-item-section>
      <q-item-label>
        {{ title }}
      </q-item-label>
      <q-item-label caption>{{ description }}</q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-item-label caption>{{ dt.short(newsItem.timestamp) }}</q-item-label>
      <q-item-label caption>{{ dt.time(newsItem.timestamp) }}</q-item-label>
      <q-badge class="q-mt-md" :style="{ backgroundColor: color }">
        {{ $t(`category.${newsItem.category}`) }}
      </q-badge>
    </q-item-section>
  </q-item>
</template>
<script setup>
import { computed } from 'vue'
import { dt } from '@/utils'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { useApplicationStore } from '@/stores/applicationStore'
const applicationStore = useApplicationStore()

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
})

function onClickItem() {
  applicationStore.showFocusedNewsItemPopup = false
  applicationStore.focusedNewsItem = props.newsItem
  applicationStore.leftDrawerOpen = false
  applicationStore.markAsSeen(props.newsItem)
}

const title = computed(() => {
  return props.newsItem.title[locale.value]
})

const description = computed(() => {
  return props.newsItem.description[locale.value]
})

const category = computed(() => {
  return newsStore.categories[props.newsItem.category]
})

const color = computed(() => {
  return category.value?.color || ''
})
</script>
<style lang="scss" scoped>
.icon {
  margin-top: 10px;
}
.red-dot {
  position: absolute;
  top: 10px;
  left: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: $red;
}
</style>
