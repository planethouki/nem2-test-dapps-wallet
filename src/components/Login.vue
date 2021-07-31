<template>
  <div>
    <div class="mb-3">
      <label for="inputPassword" class="form-label">Password</label>
      <input
        type="password"
        class="form-control"
        id="inputPassword"
        v-model="inputPassword">
    </div>
    <button type="button" class="btn btn-primary" @click="save">Login</button>
  </div>

</template>

<script>

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
      inputPassword: ''
    }
  },
  methods: {
    save () {
      this.nem2.setPassword(this.inputPassword)
      this.inputPassword = ''
      this.$emit('login-completed')
    }
  }
}
</script>

<style scoped>

</style>
