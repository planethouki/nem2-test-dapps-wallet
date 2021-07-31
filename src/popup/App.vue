<template>
  <div class="container mt-3">
    <hello-world />
    <template v-if="isBackgroundReady">
      <template v-if="isBackgroundSetUpFinished">
        <template v-if="hasPassword">
          <dashboard :nem2="nem2" />
        </template>
        <template v-else>
<!--          パスワードを入力してください-->
        </template>
      </template>
      <template v-else>
        <set-up @saved="setUpSaved" />
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
import SetUp from '@/components/SetUp.vue'

export default {
  name: 'App',
  components: { HelloWorld, Dashboard, SetUp },
  data () {
    return {
      isBackgroundSetUpFinished: false,
      isBackgroundReady: false,
      hasPassword: false,
      nem2: null
    }
  },
  created () {
    browser.runtime.getBackgroundPage().then(({ nem2 }) => {
      this.nem2 = nem2
      nem2.listenBackgroundIsReady((isReady) => {
        this.isBackgroundReady = isReady
        this.isBackgroundSetUpFinished = nem2.getIsBackgroundSetUpFinished()
        this.hasPassword = nem2.getHasPassword()
      })
    })
  },
  methods: {
    setUpSaved (setUpSaveRequest) {
      console.log('App.vue setUpSaved')
      this.nem2.setUp(setUpSaveRequest)
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
