<template>
  <div class="container mt-3">
    <hello-world />
    <template v-if="isBackgroundReady">
      <template v-if="isBackgroundSetUpFinished">
        <dashboard :nem2="nem2" />
      </template>
      <template v-else>
        <p>Need SetUp</p>
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

export default {
  name: 'App',
  components: { HelloWorld, Dashboard },
  data () {
    return {
      isBackgroundSetUpFinished: false,
      isBackgroundReady: false,
      nem2: null
    }
  },
  created () {
    browser.runtime.getBackgroundPage().then(({ nem2 }) => {
      this.nem2 = nem2
      this.isBackgroundSetUpFinished = nem2.isBackgroundSetUpFinished()
      console.log(nem2.isBackgroundSetUpFinished())
      nem2.listenBackgroundIsReady((isReady) => {
        this.isBackgroundReady = isReady
      })
    })
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
