<template>
  <div>
    <p class="position-relative">
      <span class="label">Address</span>
      <span class="p">{{ address }}</span>
    </p>
    <p class="position-relative">
      <span class="label">Network</span>
      <span class="p">{{ networkName }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
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
.label {
  position: absolute;
  top: -0.4rem;
  font-size: 0.5rem;
}
.p {
  font-size: 0.8rem;
}
</style>
