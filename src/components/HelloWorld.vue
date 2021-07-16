<template>
  <div>
    <p>{{ defaultText }}</p>
    <p>{{ backgroundHoge }}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      backgroundHoge: null
    }
  },
  mounted () {
    browser.runtime.sendMessage({})
    this.backgroundHoge = browser.extension.getBackgroundPage().hoge
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
