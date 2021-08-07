<template>
  <div>
    <div class="mb-3">
      <label for="inputPassword" class="form-label">Password</label>
      <input
        type="password"
        class="form-control"
        id="inputPassword"
        v-model="inputPassword">
      <div class="invalid-feedback" :style="{ display: invalidPasswordDisplayStyle }">
        Invalid Password
      </div>
    </div>
    <button type="button" class="btn btn-primary" @click="save">Login</button>
  </div>

</template>

<script>
import hash from '@/assets/utils/hash'

export default {
  name: 'Login',
  props: {
    nem2: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      inputPassword: '',
      invalidPasswordDisplayStyle: 'none'
    }
  },
  watch: {
    inputPassword () {
      this.invalidPasswordDisplayStyle = 'none'
    }
  },
  methods: {
    save () {
      const passwordHash = hash.hashPassword(this.inputPassword)
      const equals = this.nem2.equalsPasswordHash(passwordHash)
      if (equals === false) {
        this.invalidPasswordDisplayStyle = 'block'
        return
      }
      this.$emit('login-completed', this.inputPassword)
      this.inputPassword = ''
    }
  }
}
</script>

<style scoped>

</style>
