<template>
  <form @submit="save" ref="form">
    <div class="mb-3">
      <label for="inputPrivateKey" class="form-label">Private Key</label>
      <input
        type="text"
        class="form-control"
        id="inputPrivateKey"
        minlength="64"
        maxlength="64"
        pattern="[a-fA-F\d]+"
        aria-describedby="privateKeyHelp"
        required
        v-model="inputPrivateKey" />
      <div id="privateKeyHelp" class="form-text">hexadecimal 64 characters</div>
    </div>
    <div class="mb-3">
      <label for="inputNode" class="form-label">Node</label>
      <input
        type="text"
        class="form-control"
        id="inputNode"
        pattern="^http(|s)://.+"
        aria-describedby="nodeHelp"
        required
        v-model="inputNode" />
      <div id="nodeHelp" class="form-text">starts with http(s)</div>
    </div>
    <div class="mb-3">
      <label for="inputPassword" class="form-label">Password</label>
      <input
        type="password"
        class="form-control"
        id="inputPassword"
        minlength="8"
        aria-describedby="passwordHelp"
        required
        v-model="inputPassword" />
      <div id="passwordHelp" class="form-text">min 8 characters</div>
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
  </form>
</template>

<script>
import SetUpSaveRequest from '@/assets/models/SetUpSaveRequest'
import { v4 as uuid } from 'uuid'
import crypto from '../assets/utils/crypto'

export default {
  name: 'SetUp',
  data () {
    return {
      inputPrivateKey: '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E',
      inputNode: 'https://dg0nbr5d1ohfy.cloudfront.net:443',
      inputPassword: 'password'
    }
  },
  methods: {
    save (e) {
      e.preventDefault()
      console.log('SetUp.vue submit')
      const isValid = this.$refs.form.checkValidity()
      console.log(`SetUp.vue checkValidity ${isValid}`)
      if (!isValid) return
      const encrypted = crypto.encrypt(this.inputPrivateKey, this.inputPassword)
      const req = new SetUpSaveRequest(uuid(), encrypted, this.inputNode, this.inputPassword)
      this.$emit('saved', req)
    }
  }
}
</script>

<style scoped>
</style>
