'use strict'

const fp = require('fastify-plugin')
const postgres = require('fastify-postgres')

// todo move to configuration
async function fastifyPostgres (fastify, opts) {
  fastify.register(postgres, {
    //     connectionString: 'postgresql://localhost:5432/cuppa-authentication',
    connectionString: 'postgres://localhost/cuppa-authentication',
    user: 'cuppa-authentication',
    password: 'toor-authentication-cuppa'
  })
}

module.exports = fp(fastifyPostgres)
