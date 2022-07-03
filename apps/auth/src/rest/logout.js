'use strict'

import S from 'fluent-json-schema'

export default async function logoutService (fastify) {
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

  const { user: userRepository } = fastify.repositories

  async function onLogout (req, reply) {
    await userRepository.storeRefreshToken(req.user.id, null)
    reply.clearCookie(fastify.config.JWT_REFRESH_COOKIE)
    return { status: 'ok' }
  }
}
