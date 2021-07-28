<template>
  <div>
    <div class="mb-3">
      <label for="inputPrivateKey" class="form-label">Private Key</label>
      <input
        type="text"
        class="form-control"
        id="inputPrivateKey"
        aria-describedby="privateKeyHelp"
        v-model="inputPrivateKey">
      <div id="privateKeyHelp" class="form-text"></div>
    </div>
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
import crypto from '../assets/utils/crypto'

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
      browser.runtime.getBackgroundPage().then(({ nem2 }) => {
        const encrypted = crypto.encrypt(this.inputPrivateKey, nem2.getPassword())
        nem2.setSettings(new SettingsSaveRequest(uuid(), encrypted, this.inputNode))
        this.$emit('saved')
      })
    },
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>
</style>
