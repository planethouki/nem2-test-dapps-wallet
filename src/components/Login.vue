<template>
  <div>
    <template v-if="isShowResetConfirm">
      <factory-set :nem2="nem2" @back="isShowResetConfirm = false" />
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
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="isShowResetConfirm = true">
          Reset Account
        </button>
      </div>
    </template>
  </div>

</template>

<script>
import hash from '@/assets/utils/hash'
import FactorySet from '@/components/FactorySet.vue'

export default {
  name: 'Login',
  components: { FactorySet },
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
    }
  }
}
</script>

<style scoped>

</style>
