<template>
  <div>
    <labeled-item label="Address" :description="address" />
    <labeled-item label="Network" :description="networkName" />
  </div>
</template>

<script>
import LabeledItem from './LabeledItem'

export default {
  name: 'Dashboard',
  components: { LabeledItem },
  props: {
    accountInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    address () {
      if (!this.accountInfo) return ''
      if (!this.accountInfo.addressPlain) return ''
      return this.accountInfo.addressPlain
    },
    networkName () {
      if (!this.accountInfo) return ''
      if (!this.accountInfo.networkName) return ''
      return this.accountInfo.networkName
    }
  }
}
</script>

<style scoped>
</style>
