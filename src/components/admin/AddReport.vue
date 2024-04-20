<template>
  <q-form style="height: 100%">
    <div class="flex row content-between stretch-items" style="height: 100%">
      <div>
        <h5>{{ $t('admin.menu.addReport') }}</h5>
        <q-separator />
        <q-input
          v-model="blankReport.title"
          :label="$t('admin.addReport.title')"
          :disable="saving"
        />
        <q-select
          v-model="blankReport.category"
          :label="$t('admin.addReport.category')"
          :options="reportStore.categoryOptions"
          class="q-my-sm"
          :disable="saving"
        >
          <!-- <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template> -->
        </q-select>
        <q-editor
          v-model="blankReport.description"
          min-height="5rem"
          class="q-my-sm"
          :placeholder="$t('admin.addReport.description')"
          :disable="saving"
        />
        <q-date v-model="dateRange" range class="q-my-sm" :disable="saving" />
      </div>
      <div class="q-mt-sm row stretch-items" style="width: 100%">
        <q-btn color="primary" class="col" :disable="saving || !isValid" @click="saveReport">
          {{ $t('admin.addReport.publish') }}
          <q-spinner size="xs" v-if="saving" class="q-ml-xs" />
        </q-btn>
        <q-btn color="grey-4" class="col q-ml-sm" :disable="saving">
          {{ $t('shared.cancel') }}
        </q-btn>
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { DateTime } from 'luxon'
import { dt } from '@/utils'
import { ref, computed } from 'vue'
import { useReportStore } from '@/stores/reportStore'
const reportStore = useReportStore()

const blankReport = ref(reportStore.blankReport)

const saving = ref(true)

const isValid = computed(() => {
  return true
})

async function saveReport() {
  this.saving.value = true
  try {
    await reportStore.addReport(blankReport.value)
  } catch (e) {
    consol.log(e)
  } finally {
    this.saving.value = false
  }
}

const dateRange = computed({
  get() {
    if (DateTime.isDateTime(blankReport.value.activeUntil)) {
      return {
        from: dt.toQuasarDateString(blankReport.value.activeFrom),
        to: dt.toQuasarDateString(blankReport.value.activeUntil),
      }
    }
    return dt.toQuasarDateString(blankReport.value.activeFrom)
  },
  set(val) {
    if (val instanceof String) {
      blankReport.value.activeFrom = dt.parseQuasarDateString(val)
      blankReport.value.activeUntil = ''
    }

    if (val instanceof Object) {
      blankReport.value.activeFrom = dt.parseQuasarDateString(val.from)
      blankReport.value.activeUntil = dt.parseQuasarDateString(val.to)
    }
  },
})
</script>
