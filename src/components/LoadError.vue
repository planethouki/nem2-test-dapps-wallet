<template>
  <div>
    <div>Network Error. Please input another node.</div>
    <div class="mb-3">
      <label for="inputNode" class="form-label">Node</label>
      <input
        type="text"
        class="form-control"
        id="inputNode"
        v-model="inputNode">
    </div>
    <button type="button" class="btn btn-primary" @click="save">Save</button>
  </div>
</template>

<script>
export default {
  name: 'LoadError',
  props: {
    nem2: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      inputNode: ''
    }
  },
  created () {
    this.inputNode = this.nem2.getEndPoint()
  },
  methods: {
    save () {
      this.$emit('save', this.inputNode)
    }
  }
}
</script>

<style scoped>
</style>
