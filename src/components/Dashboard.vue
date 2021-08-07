<template>
  <div>
    <template v-if="isInSettings">
      <settings :nem2="nem2" @save="saveSetting" @back="isInSettings = false" />
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
import Settings from '@/components/Settings'
import Account from '@/components/Account'

export default {
  name: 'Dashboard',
  components: { Settings, Account },
  props: {
    nem2: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      accountInfo: null,
      isInSettings: false
    }
  },
  created () {
    this.accountInfo = this.nem2.getAccountInfo()
  },
  methods: {
    saveSetting (request) {
      this.nem2.setSettings(request)
      this.isInSettings = false
    }
  }
}
</script>

<style scoped>

</style>
