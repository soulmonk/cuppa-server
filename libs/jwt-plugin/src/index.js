'use strict'

import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

async function fastifyJWT (fastify, opts) {
  const skipOnRoute = opts.ignoreRoutes ? (route) => opts.ignoreRoutes[route] : () => false;
  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET
  })

  async function authenticate (request, reply) {
    if (skipOnRoute(request.url)) {
      return true;
    }
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

  if (opts.addOnRequest) {
    fastify.addHook('onRequest', authenticate)
  }
}

export default fp(fastifyJWT, {
  fastify: '>=4',
  name: 'fastifyJWT'
})
