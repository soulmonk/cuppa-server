'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

const S = require('fluent-json-schema')
const fastifyEnv = require('@fastify/env')
const configSchema = require('./config/schema')

// todo move to global package
function statusService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/status',
    handler: onStatus,
    onRequest: async () => {},
    schema: {
      response: {
        200: S.object().prop('status', S.string())
      }
    }
  })

  async function onStatus (req, reply) {
    return { status: 'ok' }
  }
}

async function setup (fastify, opts) {
  fastify.register(fastifyEnv, {
    schema: configSchema
  })
  // fastify
  //   .register(fastifyEnv, opts)
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  statusService(fastify, opts)
}

if (require.main === module) {
  const fastify = require('fastify')({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info'
    }
  })
  setup(fastify)
    .then(() => fastify.ready())
    .then(() => fastify.listen({ port: fastify.config.PORT, host: fastify.config.FASTIFY_ADDRESS }))
    .then(() => {
      console.log(`Server listening at http://${fastify.server.address().address}:${fastify.server.address().port}`)
    })
}

module.exports = setup
