'use strict'

function loadConfig() {
  return {
    jwt: require('./jwt'),
    pg: require('./pg'),
    redis: require('./redis')
  }
}

module.exports = loadConfig
