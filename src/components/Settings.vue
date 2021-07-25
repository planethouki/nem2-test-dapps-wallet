<template>
  <div>
    <div class="mb-3">
      <label for="inputPrivateKey" class="form-label">Private Key</label>
      <input
        type="text"
        class="form-control"
        id="inputPrivateKey"
        aria-describedby="privateKeyHelp"
        :value="inputPrivateKey">
      <div id="privateKeyHelp" class="form-text"></div>
    </div>
    <div class="mb-3">
      <label for="inputNode" class="form-label">Node</label>
      <input
        type="text"
        class="form-control"
        id="inputNode"
        :value="inputNode">
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
  data () {
    return {
      inputPrivateKey: '',
      inputNode: ''
    }
  },
  methods: {
    save () {
      const result = new SettingsSaveRequest(uuid(), this.inputPrivateKey, this.inputNode)
      this.$emit('save', result)
    },
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>
</style>
