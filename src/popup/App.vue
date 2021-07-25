<template>
  <div class="container">
    <hello-world />
    <template v-if="isBackgroundReady">
      <template v-if="isInSettings">
        <settings @save="saveSettings" @back="isInSettings = false" />
      </template>
      <template v-else>
        <dashboard :accountInfo="accountInfo" />
        <hr />
        <div v-if="existsConfirmRequest">
          <p>
            Signing Request
          </p>
          <labeled-item label="Request Message" :description="signConfirmMessage" />
          <div class="d-flex">
            <div>
              <button type="button" class="btn btn-primary" @click="confirm">OK</button>
            </div>
            <div class="px-3"></div>
            <div>
              <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
            </div>
          </div>
        </div>
        <div class="position-absolute" style="top: 5px; right: 5px;">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary rounded-pill p-0"
            @click="isInSettings = true">
            &#x2699;
          </button>
        </div>
      </template>
    </template>
    <div v-else>
      <div class="spinner-grow spinner-grow-sm" role="status"></div>
      <span>Loading...</span>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Dashboard from '@/components/Dashboard.vue'
import LabeledItem from '@/components/LabeledItem'
import Settings from '@/components/Settings'

export default {
  name: 'App',
  components: { LabeledItem, HelloWorld, Dashboard, Settings },
  data () {
    return {
      existsConfirmRequest: false,
      signConfirmManager: null,
      signConfirmMessage: null,
      isBackgroundReady: false,
      accountInfo: null,
      isInSettings: false
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
    },
    saveSettings (settingsSaveRequest) {
      this.isInSettings = false
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
