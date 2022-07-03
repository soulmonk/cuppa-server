'use strict'

import fp from 'fastify-plugin'
import postgres from '@fastify/postgres'

async function fastifyPostgres (fastify) {
  fastify.register(postgres, { connectionString: fastify.config.POSTGRESQL_CONNECTION_STRING })
}

export default fp(fastifyPostgres, {
  fastify: '>=4',
  name: 'fastifyPostgres'
})
