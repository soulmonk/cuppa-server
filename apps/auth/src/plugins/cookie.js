'use strict'
import fp from 'fastify-plugin'

async function fastifyCookie (fastify, opts) {
  const options = {
    secret: fastify.config.COOKIE_SECRET,
    parseOptions: {}, // todo env ??? or hardcoded
    ...opts.cookie // todo or not )
  }
  fastify.register(import('@fastify/cookie'), options)
}

export default fp(fastifyCookie)
