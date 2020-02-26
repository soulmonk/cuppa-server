'use strict'

const fp = require('fastify-plugin')

async function fastifyCookie (fastify, opts) {

  fastify.register(require('fastify-cookie'), opts.cookie)
}

module.exports = fp(fastifyCookie)
