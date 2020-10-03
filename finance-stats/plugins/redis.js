'use strict'

const fp = require('fastify-plugin')

const redis = require('mqemitter-redis')

async function fastifyRedis (fastify, opts) {
// TODO move to fastify plugin
  const emitter = redis(opts.redis)
  fastify.decorate('redis', {})

  fastify.redis = emitter

  fastify.addHook('onClose', (_, done) => emitter.close(done))
}

module.exports = fp(fastifyRedis, {
  fastify: '3.x',
  name: 'fastifyRedis'
})
