<template>
  <q-dialog v-model="showDialog" :persistent="saving">
    <q-card class="q-pa-md">
      <q-form id="newsItemForm">
        <h6>{{ $t('admin.news.editNewsItem') }}</h6>
        <div>{{ newsItem }}</div>
        <q-select
          v-model="localNewsItem.status"
          :options="statusOptions"
          :label="$t('admin.news.status')"
          :disable="saving"
          @update:model-value="touched = true"
          emit-value
        />
        <div class="row justify-end">
          <q-btn
            flat
            color="primary"
            class="q-mt-lg"
            :label="$t('forms.cancel')"
            :disable="saving"
            @click="showDialog = false"
          />
          <q-btn
            class="q-mt-lg q-ml-sm"
            color="secondary"
            :label="$t('forms.save')"
            :loading="saving"
            :disable="!touched"
            @click="save"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const showDialog = defineModel()
const localNewsItem = ref({})
const touched = ref(false)
const saving = ref(false)
const statusOptions = ['pending', 'published', 'archived'].map((option) => ({
  label: t(`admin.news.statuses.${option}`),
  value: option,
}))

defineOptions({
  name: 'EditNewsItem',
})

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
})

watch(showDialog, (val) => {
  if (val === true) {
    touched.value = false
    localNewsItem.value = { ...props.newsItem }
  }
})

const save = async function () {
  saving.value = true
  try {
    await newsStore.updateNewsItem({ ...localNewsItem.value })
    alert.success(t('forms.saved'))
    showDialog.value = false
  } catch (e) {
    saving.value = false
    console.log(e)
    alert.error(t('forms.errorSaving'))
  }
}
</script>
<style scoped>
#newsItemForm {
  width: 500px;
}
</style>
