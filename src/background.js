browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Hello from the background')

  browser.tabs.executeScript({
    file: 'js/content-script.js'
  })
})

window.hoge = 'fuga'
