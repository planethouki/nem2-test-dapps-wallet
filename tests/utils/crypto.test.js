const crypto = require('../../src/assets/utils/crypto')

describe('crypto', () => {
  const privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E'
  const password = 'password'
  test('encrypt', () => {
    const result = crypto.encrypt(privateKey, password)
    const restore = crypto.decrypt(result, password)
    expect(restore).toBe(privateKey)
    console.log(result)
  })
})
