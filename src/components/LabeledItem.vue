<template>
  <p class="position-relative">
    <span class="label">{{ label }}</span>
    <span class="p">{{ description }}</span>
  </p>
</template>

<script>
export default {
  name: 'LabeledItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.label {
  position: absolute;
  top: -0.5rem;
  font-size: 0.6rem;
}
.p {
  overflow-wrap: anywhere;
}
</style>
