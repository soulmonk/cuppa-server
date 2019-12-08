'use strict'

const fp = require('fastify-plugin')
const basicAuth = require('fastify-basic-auth')

// TODO temp for easy start
// TODO temp var Buffer = require('safe-buffer').Buffer
// TODO temp new Buffer('username:password').toString('base64')
const users = {
  soulmonk: 'stark' // Basic c291bG1vbms6c3Rhcms=
}

//

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
    if (users[username] !== password) {
      return new Error('Invalid username or password')
    }

    req.user = {
      name: username
    }
  }
}

module.exports = fp(basicAuthPlugin)
