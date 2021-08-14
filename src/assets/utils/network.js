const axios = require('axios')

async function getProperties (endPoint) {
  return Promise.all([
    axios.request({
      method: 'GET',
      baseURL: endPoint,
      url: '/node/info',
      timeout: 5000
    }),
    axios.request({
      method: 'GET',
      baseURL: endPoint,
      url: '/network/properties',
      timeout: 5000
    })
  ]).then(([chainInfo, networkProperties]) => {
    const {
      networkGenerationHashSeed,
      networkIdentifier
    } = chainInfo.data
    return {
      generationHash: networkGenerationHashSeed,
      networkType: networkIdentifier,
      rawData: networkProperties.data
    }
  })
}

module.exports = {
  getProperties
}
