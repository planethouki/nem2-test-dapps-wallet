<template>
  <div class="container mt-3">
    <hello-world />
    <template v-if="isLoading">
      <div class="spinner-grow spinner-grow-sm" role="status"></div>
      <span>Loading...</span>
    </template>
    <template v-else-if="isBeforeSetUp">
      <set-up @saved="setUpSaved" />
    </template>
    <template v-else-if="isLoadError">
      <load-error hideClose="true" @save="saveNode"  />
    </template>
    <template v-else-if="isWaitPassword">
      <login :nem2="nem2" @login-completed="loginCompleted" />
    </template>
    <template v-else-if="isReady">
      <dashboard :nem2="nem2" />
    </template>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Dashboard from '@/components/Dashboard.vue'
import SetUp from '@/components/SetUp.vue'
import Login from '@/components/Login.vue'
import LoadError from '@/components/LoadError.vue'
import BackgroundStateType from '../assets/models/BackgroundStateType'

export default {
  name: 'App',
  components: { HelloWorld, Dashboard, SetUp, Login, LoadError },
  data () {
    return {
      isLoading: false,
      isBeforeSetUp: false,
      isLoadError: false,
      isWaitPassword: false,
      isReady: false,
      nem2: null
    }
  },
  created () {
    browser.runtime.getBackgroundPage().then(({ nem2 }) => {
      this.nem2 = nem2
      nem2.listenBackgroundState((stateInfo) => {
        console.log('App.vue', stateInfo.type)
        this.isLoading = stateInfo.type === BackgroundStateType.BACKGROUND_LOADING
        this.isBeforeSetUp = stateInfo.type === BackgroundStateType.BACKGROUND_BEFORE_SETUP
        this.isLoadError = stateInfo.type === BackgroundStateType.BACKGROUND_LOAD_ERROR
        this.isWaitPassword = stateInfo.type === BackgroundStateType.BACKGROUND_WAIT_PASSWORD
        this.isReady = stateInfo.type === BackgroundStateType.BACKGROUND_READY
      })
    })
  },
  methods: {
    setUpSaved (setUpSaveRequest) {
      console.log('App.vue setUpSaved')
      this.nem2.setUp(setUpSaveRequest)
    },
    loginCompleted (inputPassword) {
      this.nem2.setPassword(inputPassword)
    },
    saveNode (inputNode) {
      this.nem2.setEndPoint(inputNode)
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
