<template>
  <q-dialog v-model="showDialog" :persistent="saving">
    <q-card class="q-pa-md delete-card">
      <q-form>
        <div class="text-h6 q-mb-md">{{ $t('admin.municipalities.deleteMunicipality') }}</div>
        <div>{{ localMunicipality.name[locale] }}</div>
        <div class="flex flex-row justify-end">
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
            color="negative"
            :label="$t('forms.delete')"
            :loading="saving"
            @click="save"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRiskLevelsStore } from '@/stores/riskLevelsStore'
const riskLevelsStore = useRiskLevelsStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const showDialog = defineModel()
const localMunicipality = ref({})
const saving = ref(false)

const props = defineProps({
  municipality: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

watch(showDialog, (val) => {
  if (val === true) {
    saving.value = false
    localMunicipality.value = { ...props.municipality }
  }
})

const save = async function () {
  saving.value = true
  try {
    await riskLevelsStore.deleteMunicipality({ ...localMunicipality.value })
    await riskLevelsStore.fetchRiskLevels()
    alert.success(t('forms.saved'))
    emit('delete')
    showDialog.value = false
  } catch (e) {
    saving.value = false
    console.log(e)
    alert.error(t('forms.errorSaving'))
  }
}
</script>
<style scoped>
.delete-card {
  min-width: 400px;
}
</style>
