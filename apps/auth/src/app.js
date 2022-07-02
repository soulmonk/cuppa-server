'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const fastifyEnv = require('@fastify/env')
const configSchema = require('./config/schema')

async function setup (fastify, opts) {
  fastify.register(fastifyEnv, {
    schema: configSchema
  })
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in rest
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'rest'),
    options: Object.assign({}, opts)
  })
}

if (require.main === module) {
  const fastify = require('fastify')({
    logger: {
      level: 'info'
    }
  })
  setup(fastify)
    .then(() => fastify.ready())
    .then(() => fastify.listen(fastify.config.PORT, fastify.config.FASTIFY_ADDRESS))
    .then(() => console.log(`Server listening at http://${fastify.server.address().address}:${fastify.server.address().port}`))
    .catch(err => {
      console.error(err)
    })
}

module.exports = setup
