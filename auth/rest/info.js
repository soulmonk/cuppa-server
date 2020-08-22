'use strict'

const S = require('fluent-schema')

async function meService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/info',
    handler: onInfo,
    onRequest: fastify.authenticate,
    schema: {
      response: {
        200: S.object()
          .prop('username', S.string())
      }
    }
  })

  async function onInfo (req, reply) {
    const user = await this.repositories.user.getUserById(req.user.id)
    return {
      username: user.name
    }
  }
}

module.exports = meService
