'use strict'

const fp = require('fastify-plugin')

async function fastifyCookie (fastify) {
  fastify.register(require('@fastify/cors'), {
    origin: fastify.config.CORS.split(','),
    credentials: true
  })
}

module.exports = fp(fastifyCookie)
