'use strict'

const fp = require('fastify-plugin')
const jwt = require('fastify-jwt')

// todo with config set up on request
async function fastifyJWT (fastify, opts) {

  fastify.decorateRequest('user', null)

  fastify.register(jwt, {
    secret: opts.jwt.secret
  })

  async function authenticate (request, reply) {
    const error = (err) => {
      reply.log.error(err)
      reply.code(401).send({ message: 'Could not authenticate' })
      return false
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
      return error(err)
    }
    return true
  }

  fastify.decorate('authenticate', authenticate)

  // TODO find better way
  if (opts.jwt.addHook) {
    fastify.addHook('onRequest', authenticate)
  }
}

module.exports = fp(fastifyJWT)