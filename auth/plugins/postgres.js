'use strict'

const fp = require('fastify-plugin')
const postgres = require('fastify-postgres')

// todo move auth to configuration
async function fastifyPostgres (fastify, opts) {
  fastify.register(postgres, opts.pg)
}

module.exports = fp(fastifyPostgres)
