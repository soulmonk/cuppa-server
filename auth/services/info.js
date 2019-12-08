'use strict'

const S = require('fluent-schema')

async function meService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/info',
    handler: onInfo,
    onRequest: fastify.basicAuth,
    schema: {
      response: {
        200: S.object()
          .prop('name', S.string())
      }
    }
  })

  async function onInfo (req, reply) {
    return req.user
  }
}

module.exports = meService
