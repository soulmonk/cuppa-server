'use strict'

const S = require('fluent-schema')

async function getTokenService (fastify/*, opts */) {
  fastify.route({
    method: 'POST',
    path: '/token',
    handler: onGetToken,
    schema: {
      body: S.object()
        .prop('username', S.string()
          .minLength(4)
          .maxLength(128)
          .required()
        )
        // todo additional password validation
        .prop('password', S.string()
          .minLength(8)
          .maxLength(128)
          .required()
        ),
      response: {
        200: S.object()
          .prop('token', S.string())
      }
    }
  })

  async function onGetToken (req, reply) {
    req.log.info('onGetToken')
    const { username/*, password */ } = req.body

    const token = await reply.jwtSign({ username }, {
      expiresIn: 300 // 5 minute
    })

    return { token }
  }
}

module.exports = getTokenService
