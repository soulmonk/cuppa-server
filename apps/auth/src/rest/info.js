'use strict'

import S from 'fluent-json-schema'

export default async function meService (fastify) {
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

  async function onInfo (req) {
    const user = await fastify.repositories.user.getUserById(req.user.id)
    return {
      username: user.name
    }
  }
}
