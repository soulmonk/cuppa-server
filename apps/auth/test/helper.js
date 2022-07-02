'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    jwt: {
      secret: 'some secret',
      expiresIn: 100,
      refreshExpiresIn: 86400,
      refreshCookie: 'my_refresh_token'
    }
  }
}

// automatically build and tear down our instance
async function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  await app.ready()

  return app
}

module.exports = {
  config,
  build
}
