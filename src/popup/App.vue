<template>
  <div>
    <hello-world />
    <div v-if="existsConfirmRequest">
      <span>
        Signing Request: {{ signConfirmMessage }}
      </span>
      <button @click="confirm">OK</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'App',
  components: { HelloWorld },
  data () {
    return {
      existsConfirmRequest: false,
      signConfirmManager: null,
      signConfirmMessage: null
    }
  },
  created () {
    browser.runtime.getBackgroundPage().then((background) => {
      console.log(background)
      this.signConfirmManager = background.nem2.signConfirm
      const handler = () => {
        if (this.signConfirmManager.has()) {
          this.existsConfirmRequest = true
          this.signConfirmMessage = this.signConfirmManager.firstMessage()
        } else {
          this.existsConfirmRequest = false
        }
      }
      handler()
      this.signConfirmManager.addListener(() => {
        handler()
      })
    })
  },
  methods: {
    confirm () {
      this.signConfirmManager.firstOk()
    },
    cancel () {
      this.signConfirmManager.firstCancel()
    }
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
