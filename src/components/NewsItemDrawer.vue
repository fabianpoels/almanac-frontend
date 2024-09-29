<template>
  <q-drawer
    side="left"
    v-model="applicationStore.leftDrawerOpen"
    overlay
    bordered
    class="q-pa-sm"
    style="width: 400px"
    behavior="mobile"
  >
    <div class="drawer-actions q-py-xs q-mb-sm">
      <q-btn
        dense
        unelevated
        color="secondary"
        size="sm"
        :label="$t('news.markAllAsSeen')"
        @click="applicationStore.markAllActiveAsSeen"
        :disable="loading"
      />
      <q-btn
        dense
        flat
        unelevated
        color="secondary"
        icon="refresh"
        @click="refresh"
        :loading="loading"
        :disable="disableRefresh"
      >
        <q-tooltip v-if="disableRefresh">{{ $t('news.noRefreshWhenCustom') }}</q-tooltip>
      </q-btn>
    </div>
    <div class="q-drawer-hide absolute" style="top: calc(50% - 50px); right: -20px">
      <q-btn
        dense
        round
        unelevated
        color="primary"
        icon="chevron_left"
        @click="applicationStore.leftDrawerOpen = false"
      />
    </div>

    <q-scroll-area class="scroll-area">
      <q-pull-to-refresh @refresh="refresh" :disable="disableRefresh">
        <news-item-list />
      </q-pull-to-refresh>
    </q-scroll-area>
  </q-drawer>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { useApplicationStore } from '@/stores/applicationStore'
const applicationStore = useApplicationStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import NewsItemList from '@/components/NewsItemList.vue'

const loading = ref(false)

async function refresh(done) {
  loading.value = true
  try {
    await newsStore.fetchNewsItems()
  } catch (e) {
    console.error(e)
    alert.error(t('map.errorLoading'))
  } finally {
    loading.value = false
    if (typeof done === 'function') done()
  }
}

const disableRefresh = computed(() => {
  return newsStore.timespan === 'custom'
})
</script>
<style scoped>
.drawer-actions {
  height: 39px;
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: space-between;
}
.scroll-area {
  height: calc(100% - 47px);
}
</style>
