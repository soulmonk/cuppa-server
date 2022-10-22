'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

const statusService = require('@cuppa-server/status-handler')
const fastifyEnv = require('@fastify/env')
const configSchema = require('./config/schema')
const jwtPlugin = require('@cuppa-server/jwt-plugin')

async function setup (fastify, opts) {
  fastify.register(fastifyEnv, {
    schema: configSchema,
  })
  fastify.register(require('@fastify/cors'), {
    origin: (process.env.CORS ?? '').split(','),
    credentials: true,
  })

  // Do not touch the following lines
  // TODO should be in plugins folder to work both with cors
  fastify.register(jwtPlugin, {
    addOnRequest: true,
    ignoreRoutes: { '/status': 1 },
  })

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })

  statusService(fastify)
}

if (require.main === module) {
  const fastify = require('fastify')({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  })
  setup(fastify)
    .then(() => fastify.ready())
    .then(() => fastify.listen({ port: fastify.config.PORT, host: fastify.config.FASTIFY_ADDRESS }))
    .then(() => {
      console.log(`Server listening at http://${fastify.server.address().address}:${fastify.server.address().port}`)
    })
}

module.exports = setup
