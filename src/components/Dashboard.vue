<template>
  <div>
    <template v-if="isInSettings">
      <settings :nem2="nem2" @save="saveSetting" @back="isInSettings = false" />
    </template>
    <template v-else-if="existsConfirmRequest">
      <div>
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
    </template>
    <template v-else>
      <account :accountInfo="accountInfo" />
      <div class="position-absolute" style="top: 5px; right: 5px;">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary rounded-pill p-0"
          @click="isInSettings = true">
          &#x2699;
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import LabeledItem from '@/components/LabeledItem'
import Settings from '@/components/Settings'
import Account from '@/components/Account'

export default {
  name: 'Dashboard',
  components: { LabeledItem, Settings, Account },
  props: {
    nem2: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      existsConfirmRequest: false,
      signConfirmManager: null,
      signConfirmMessage: null,
      accountInfo: null,
      isInSettings: false
    }
  },
  created () {
    this.signConfirmManager = this.nem2.signConfirmManager
    this.accountInfo = this.nem2.getAccountInfo()
    const handler = () => {
      const has = this.signConfirmManager.hasSignConfirm()
      this.existsConfirmRequest = has
      if (!has) return
      this.signConfirmMessage = this.signConfirmManager.firstMessage()
    }
    handler()
    this.signConfirmManager.addListener(handler)
  },
  methods: {
    confirm () {
      this.signConfirmManager.firstOk()
    },
    cancel () {
      this.signConfirmManager.firstCancel()
    },
    saveSetting (request) {
      this.nem2.setSettings(request)
      this.isInSettings = false
    }
  }
}
</script>

<style scoped>

</style>
