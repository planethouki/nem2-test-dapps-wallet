<template>
  <div>
    <template v-if="isShowResetConfirm">
      <factory-set :nem2="nem2" @back="isShowResetConfirm = false" />
    </template>
    <template v-else>
      <div class="mb-3">
        <label for="inputNode" class="form-label">Node (TestNet Only)</label>
        <input
          type="text"
          class="form-control"
          id="inputNode"
          v-model="inputNode">
        <div class="mb-3"></div>
        <button type="button" class="btn btn-primary" @click="save">Save</button>
        <span class="px-1"></span>
        <button type="button" class="btn btn-secondary" @click="back">Back</button>
        <span>{{ settingMessage }}</span>
      </div>
      <hr />
      <div class="mb-3">
        <p>Account Reset</p>
        <button type="button" class="btn btn-sm btn-danger" @click="isShowResetConfirm = true">
          Submit
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import FactorySet from '@/components/FactorySet.vue'
import SettingsSaveRequest from '@/assets/models/SettingsSaveRequest'
import { v4 as uuid } from 'uuid'
import network from '../assets/utils/network'

export default {
  name: 'Settings',
  components: { FactorySet },
  props: {
    nem2: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      inputNode: '',
      isShowResetConfirm: false,
      settingMessage: '',
      resetMessage: ''
    }
  },
  created () {
    this.inputNode = this.nem2.getEndPoint()
  },
  methods: {
    async save () {
      const checkNode = await network.checkNode(this.inputNode)

      if (checkNode.success === false) {
        this.settingMessage = 'cannot access node'
        return
      }

      if (checkNode.data.isTestNet === false) {
        this.settingMessage = 'Only Testnet is supported.'
        return
      }

      const request = new SettingsSaveRequest(uuid(), this.inputNode)
      this.$emit('save', request)
    },
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>
</style>
