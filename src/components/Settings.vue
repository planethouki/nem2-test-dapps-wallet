<template>
  <div>
    <div class="mb-3">
      <label for="inputNode" class="form-label">Node</label>
      <input
        type="text"
        class="form-control"
        id="inputNode"
        v-model="inputNode">
    </div>
    <button type="button" class="btn btn-primary" @click="save">Save</button>
    <span class="px-1"></span>
    <button type="button" class="btn btn-secondary" @click="back">Back</button>
  </div>
</template>

<script>
import SettingsSaveRequest from '@/assets/models/SettingsSaveRequest'
import { v4 as uuid } from 'uuid'

export default {
  name: 'Settings',
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
      this.nem2.setSettings(new SettingsSaveRequest(uuid(), this.inputNode))
      this.$emit('saved')
    },
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>
</style>
