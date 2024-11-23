<template>
  <div class="poi-icon row justify-center items-center">
    <q-icon :name="icon" color="white" size="14px" />
  </div>
</template>
<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
})
</script>
<style lang="scss" scoped>
.poi-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: $blue-grey-4;
  opacity: 90%;
}
</style>
