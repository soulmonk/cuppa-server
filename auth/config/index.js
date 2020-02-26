'use strict'

function loadConfig () {
  return {
    jwt: require('./jwt'),
    user: require('./user'),
    pg: require('./pg'),
    cookie: require('./cookie')
  }
}

module.exports = loadConfig
