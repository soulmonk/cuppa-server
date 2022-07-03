'use strict'

const fp = require('fastify-plugin')

async function fastifyRedis (fastify) {
  fastify.register(require('@fastify/redis'), { url: fastify.config.REDIS_CONNECTION_STRING })
}

module.exports = fp(fastifyRedis, {
  fastify: '4.x',
  name: 'fastifyRedis'
})
