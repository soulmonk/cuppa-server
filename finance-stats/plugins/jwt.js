'use strict'

const fp = require('fastify-plugin')
const jwt = require('fastify-jwt')

// todo as repository ?, copied because docker could not copy out of context
async function fastifyJWT (fastify, opts) {
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

  fastify.addHook('onRequest', authenticate)
}

module.exports = fp(fastifyJWT, {
  fastify: '3.x',
  name: 'fastifyJWT'
})
