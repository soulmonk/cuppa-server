'use strict'

import fp from 'fastify-plugin'

async function fastifyCors (fastify) {
  fastify.register(import('@fastify/cors'), {
    origin: fastify.config.CORS.split(','),
    credentials: true
  })
}

export default fp(fastifyCors)
