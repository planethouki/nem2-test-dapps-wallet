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
  top: -0.4rem;
  font-size: 0.5rem;
}
.p {
  font-size: 0.8rem;
}
</style>
