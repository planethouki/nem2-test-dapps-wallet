<template>
  <div class="container">
    <hello-world />
    <div v-if="isBackgroundLoaded">
      <div v-if="existsConfirmRequest">
      <span>
        Signing Request: {{ signConfirmMessage }}
      </span>
        <button type="button" class="btn btn-primary" @click="confirm">OK</button>
        <button type="button" class="btn btn-primary" @click="cancel">Cancel</button>
      </div>
    </div>
    <div v-else>
      Loading...
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
      signConfirmMessage: null,
      isBackgroundLoaded: false
    }
  },
  created () {
    browser.runtime.getBackgroundPage().then((background) => {
      this.signConfirmManager = background.nem2.signConfirm
      background.nem2.listenBackgroundIsReady((isReady) => {
        this.isBackgroundLoaded = isReady
      })
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
