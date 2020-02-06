'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

const S = require('fluent-schema')

// todo move to global package
function statusService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/status',
    handler: onStatus,
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

module.exports = function (fastify, opts, next) {
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  statusService(fastify, opts)

  // Make sure to call next when done
  next()
}
