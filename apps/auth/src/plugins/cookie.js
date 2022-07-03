'use strict'
const fp = require('fastify-plugin')

async function fastifyCookie (fastify, opts) {
  const options = {
    secret: fastify.config.COOKIE_SECRET,
    parseOptions: {}, // todo env ??? or hardcoded
    ...opts.cookie // todo or not )
  }
  fastify.register(require('@fastify/cookie'), options)
}

module.exports = fp(fastifyCookie)
