'use strict'

const fp = require('fastify-plugin')
const basicAuth = require('fastify-basic-auth')

/**
 * Basic authentication plugin
 * This plugin registers the utility for parsing basic authentication headers,
 * and the logic to verify username and passowrd.
 */
async function basicAuthPlugin (fastify, opts) {
  fastify.register(basicAuth, { validate })

  fastify.decorateRequest('user', null)

  // The headers parsing is handled by the basicAuth plugin
  // we only need to validate the username and password.
  // If username or password are not valid, we'll throw
  // an expection, and the user will get a 401.
  async function validate (username, password, req, reply) {

    // TODO check via grpc from auth service
    req.user = { name: 'Not implemented' }
  }
}

module.exports = fp(basicAuthPlugin)
