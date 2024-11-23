<template>
  <q-dialog v-model="showDialog" :persistent="saving">
    <q-card class="q-pa-md">
      <q-form>
        <h6>{{ $t('admin.riskLevels.deleteRiskLevel') }}</h6>
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
            color="secondary"
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
import { ref, computed, watch } from 'vue'
import { useRiskLevelsStore } from '@/stores/riskLevelsStore'
const riskLevelsStore = useRiskLevelsStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const showDialog = defineModel()
const localRiskLevel = ref({})
const saving = ref(false)

const props = defineProps({
  riskLevel: {
    type: Object,
    required: true,
  },
})

watch(showDialog, (val) => {
  if (val === true) {
    saving.value = false
    localRiskLevel.value = { ...props.riskLevel }
  }
})

const save = async function () {
  saving.value = true
  try {
    await riskLevelsStore.deleteRiskLevel({ ...localRiskLevel.value })
    alert.success(t('forms.saved'))
    showDialog.value = false
  } catch (e) {
    saving.value = false
    console.log(e)
    alert.error(t('forms.errorSaving'))
  }
}
</script>
<style scoped></style>
