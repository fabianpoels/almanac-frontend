<template>
  <div>
    <svg display="block" height="41px" width="27px" viewBox="0 0 27 41">
      <defs>
        <radialGradient id="shadowGradient">
          <stop offset="10%" stop-opacity="0.4"></stop>
          <stop offset="100%" stop-opacity="0.05"></stop>
        </radialGradient>
      </defs>
      <ellipse cx="13.5" cy="34.8" rx="10.5" ry="5.25" fill="url(#shadowGradient)"></ellipse>
      <path
        :fill="props.color"
        :opacity="[isDimmed ? 0.25 : 1]"
        d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"
      ></path>
    </svg>
    <i
      class="q-icon notranslate material-icons"
      aria-hidden="true"
      role="img"
      style="
        width: 27px;
        height: 27px;
        color: #fff;
        font-size: 1.715em;
        position: absolute;
        top: 0;
        left: 0;
      "
    >
      {{ props.icon }}
    </i>
    <div v-if="props.isNew" class="red-dot" />
  </div>
</template>
<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  isDimmed: {
    type: Boolean,
    default: false,
  },
})
</script>
<style lang="scss" scoped>
.map-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.red-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: $red;
}
</style>
