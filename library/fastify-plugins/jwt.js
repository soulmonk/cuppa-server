'use strict'

const fp = require('fastify-plugin')
const jwt = require('fastify-jwt')

async function fastifyJWT (fastify, opts) {

  fastify.decorateRequest('user', null)

  fastify.register(jwt, {
    secret: opts.jwt.secret
  })

  fastify.decorate('authenticate', async function (request, reply) {
    const error = (err) => {
      reply.log.error(err);
      reply.send("Could not authenticate")
    }
    try {
      const data = await request.jwtVerify()
      if (!data.id) {
        return error(new Error('wrong payload'))
      }
      request.user = {
        id: data.id
      }
    } catch (err) {
      error(err)
    }
  })
}

module.exports = fp(fastifyJWT)
