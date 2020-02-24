'use strict'

const S = require('fluent-schema')
const UserRepository = require('../repository/user')

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
    return UserRepository.getUserById(this.pg, req.user.id)
  }
}

module.exports = meService
