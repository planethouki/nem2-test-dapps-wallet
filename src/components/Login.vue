<template>
  <div>
    <template v-if="isShowResetConfirm">
      <button type="button" class="btn btn-danger" @click="resetAccount">
        Reset Account
      </button>
      <span class="d-inline-block me-3"></span>
      <button type="button" class="btn btn-secondary" @click="isShowResetConfirm = false">
        Back
      </button>
    </template>
    <template v-else>
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
        <div class="mb-3"></div>
        <button type="button" class="btn btn-primary" @click="save">Login</button>
      </div>
      <div class="mb-3"></div>
      <div class="mb-3">
        <p>forgot password ?</p>
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="confirmResetAccount">
          Reset Account
        </button>
      </div>
    </template>
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
      invalidPasswordDisplayStyle: 'none',
      isShowResetConfirm: false
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
    },
    confirmResetAccount () {
      this.isShowResetConfirm = true
    },
    resetAccount () {
      this.nem2.factorySet()
    }
  }
}
</script>

<style scoped>

</style>
