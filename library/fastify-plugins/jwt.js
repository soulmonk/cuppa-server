'use strict'

const fp = require('fastify-plugin')
const jwt = require('fastify-jwt')

async function fastifyJWT (fastify, opts) {

  fastify.decorateRequest('user', null)

  fastify.register(jwt, {
    secret: opts.jwt.secret
  })

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      const data = await request.jwtVerify()
      request.user = {
        id: data.id
      }
    } catch (err) {
      reply.log.error(err);
      reply.send("Could not authenticate")
    }
  })
}

module.exports = fp(fastifyJWT)
