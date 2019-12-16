'use strict'

const fp = require('fastify-plugin')
const jwt = require('fastify-jwt')

// todo move to configuration
async function fastifyJWT (fastify, opts) {
  fastify.register(jwt, {
    secret: 'n7GzgBPYMAgppYiEP8lMp6rQiphbeWYquIG5xTvl8Z6hcey6eqNYT7UQrh6IexR2'
  })

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

module.exports = fp(fastifyJWT, {
  dependencies: ['fastifyPostgres']
})
