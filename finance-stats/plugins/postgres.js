'use strict'

const fp = require('fastify-plugin')
const postgres = require('fastify-postgres')

// todo move auth to configuration
async function fastifyPostgres (fastify/*, opts */) {
  fastify.register(postgres, {
    connectionString: 'postgres://localhost/cuppa-finance-stats',
    user: 'cuppa',
    password: 'toor-cuppa'
  })
}

module.exports = fp(fastifyPostgres)
