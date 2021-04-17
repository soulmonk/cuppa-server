'use strict'

const fp = require('fastify-plugin')
const postgres = require('fastify-postgres')

async function fastifyPostgres (fastify) {
  fastify.register(postgres, { connectionString: fastify.config.POSTGRESQL_CONNECTION_STRING })
}

module.exports = fp(fastifyPostgres, {
  fastify: '>=3',
  name: 'fastifyPostgres'
})
