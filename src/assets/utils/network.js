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

async function checkNode (baseUrl) {
  return axios
    .request({
      method: 'GET',
      baseURL: baseUrl,
      url: '/node/info',
      timeout: 5000
    })
    .then((res) => {
      return {
        success: true,
        data: {
          isTestNet: res.data.networkIdentifier === 152
        }
      }
    })
    .catch((e) => {
      return {
        success: false,
        data: {
          error: e
        }
      }
    })
}

module.exports = {
  getProperties,
  checkNode
}
