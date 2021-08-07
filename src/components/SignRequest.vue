<template>
  <div>
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
  </div>
</template>

<script>
import LabeledItem from '@/components/LabeledItem'

export default {
  name: 'SignRequest',
  components: { LabeledItem },
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
      accountInfo: null
    }
  },
  created () {
    this.signConfirmManager = this.nem2.signConfirmManager
    this.accountInfo = this.nem2.getAccountInfo()
    const handler = (signRequestCount) => {
      const has = signRequestCount > 0
      this.existsConfirmRequest = has
      if (!has) return
      this.signConfirmMessage = this.signConfirmManager.firstMessage()
    }
    this.signConfirmManager.addListener(handler)
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

<style scoped>

</style>
