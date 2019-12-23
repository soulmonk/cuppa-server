'use strict'

const fp = require('fastify-plugin')
const postgres = require('fastify-postgres')

// todo move auth to configuration
async function fastifyPostgres (fastify/*, opts */) {
  fastify.register(postgres, {
    connectionString: 'postgres://localhost/cuppa-authentication',
    user: 'cuppa-authentication',
    password: 'toor-authentication-cuppa'
  })
}

module.exports = fp(fastifyPostgres)
