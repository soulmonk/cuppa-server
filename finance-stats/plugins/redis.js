'use strict'

const fp = require('fastify-plugin')

const redis = require('mqemitter-redis')

async function fastifyRedis (fastify) {
// TODO move to fastify plugin
  const emitter = redis({
    port: 6379,
    host: '127.0.0.1'
  })
  fastify.decorate('redis', {})

  fastify.redis = emitter

  fastify.addHook('onClose', (_, done) => emitter.close(done))
}

module.exports = fp(fastifyRedis)
