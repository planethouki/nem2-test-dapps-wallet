<template>
  <div>
    <p>Reset Account</p>
    <button type="button" class="btn btn-danger" @click="resetAccount">
      Submit
    </button>
    <span class="d-inline-block me-3"></span>
    <button type="button" class="btn btn-secondary" @click="back">
      Back
    </button>
  </div>
</template>

<script>
export default {
  name: 'FactorySet',
  props: {
    nem2: {
      type: Object,
      required: true
    }
  },
  methods: {
    resetAccount () {
      this.nem2.factorySet()
    },
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>

</style>
