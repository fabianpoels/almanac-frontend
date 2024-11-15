<template>
  <q-btn color="negative" icon="phone" @click="showDialog = true" class="q-mr-md">
    <div class="button-text q-ml-sm">SOS</div>
  </q-btn>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section class="row items-center">
        <h6>{{ $t('sos.title') }}</h6>
        <p>{{ $t('sos.text') }}</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn href="tel:+961-111111" :label="$t('sos.callUs')" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue'

const showDialog = ref(false)

defineOptions({
  name: 'SosButton',
})
</script>
<style scoped>
@media only screen and (max-width: 500px) {
  .button-text {
    display: none;
  }
}
</style>
