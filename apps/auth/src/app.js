'use strict'

import fastifyEnv from '@fastify/env'
import configSchema from './config/schema.js'
import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import statusService from '@cuppa-server/status-handler'
import Fastify from 'fastify'

async function setup (fastify, opts) {
  fastify.register(fastifyEnv, {
    schema: configSchema,
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })

  statusService(fastify)

  // This loads all plugins defined in rest
  // define your routes in one of these
  fastify.register(autoLoad, {
    dir: join(__dirname, 'rest'),
    options: Object.assign({}, opts),
  })
}

const fastify = Fastify({
  logger: {
    level: 'info',
  },
})
setup(fastify)
  .then(() => fastify.ready())
  // @ts-ignore
  .then(() => fastify.listen({ port: fastify.config.PORT, host: fastify.config.FASTIFY_ADDRESS }))
  // @ts-ignore
  .then(() => console.log(`Server listening at http://${fastify.server.address().address}:${fastify.server.address().port}`))
  .catch(err => {
    console.error(err)
  })

