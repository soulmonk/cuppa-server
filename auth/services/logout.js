'use strict'

const S = require('fluent-schema')
const UserRepository = require('../repository/user')

async function logoutService (fastify, opts) {
  fastify.route({
    method: 'POST',
    path: '/logout',
    handler: onLogout,
    onRequest: fastify.authenticate,
    schema: {
      response: {
        200: S.object()
          .prop('status', S.string())
      }
    }
  })

  async function onLogout (req, reply) {
    await UserRepository.storeRefreshToken(this.pg, req.user.id, null)
    reply.clearCookie(opts.jwt.refreshCookie)
    return {status: 'ok'}
  }
}

module.exports = logoutService
