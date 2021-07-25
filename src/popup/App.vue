<template>
  <div class="container">
    <hello-world />
    <div v-if="isBackgroundReady">
      <dashboard :accountInfo="accountInfo" />
      <hr />
      <div v-if="existsConfirmRequest">
        <span>
          Signing Request: {{ signConfirmMessage }}
        </span>
        <button type="button" class="btn btn-primary" @click="confirm">OK</button>
        <button type="button" class="btn btn-primary" @click="cancel">Cancel</button>
      </div>
    </div>
    <div v-else>
      <div class="spinner-grow spinner-grow-sm" role="status"></div>
      <span>Loading...</span>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Dashboard from '@/components/Dashboard.vue'

export default {
  name: 'App',
  components: { HelloWorld, Dashboard },
  data () {
    return {
      existsConfirmRequest: false,
      signConfirmManager: null,
      signConfirmMessage: null,
      isBackgroundReady: false,
      accountInfo: null
    }
  },
  created () {
    browser.runtime.getBackgroundPage().then(({ nem2 }) => {
      this.signConfirmManager = nem2.signConfirm
      nem2.listenBackgroundIsReady((isReady) => {
        this.isBackgroundReady = isReady
        if (!isReady) return
        this.accountInfo = nem2.getAccountInfo()
      })
      const handler = () => {
        const has = this.signConfirmManager.has()
        this.existsConfirmRequest = has
        if (!has) return
        this.signConfirmMessage = this.signConfirmManager.firstMessage()
      }
      handler()
      this.signConfirmManager.addListener(handler)
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
