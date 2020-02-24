'use strict'

function loadConfig() {
  return {
    jwt: require('./jwt'),
    user: require('./user'),
    pg: require('./pg')
  }
}

module.exports = loadConfig
