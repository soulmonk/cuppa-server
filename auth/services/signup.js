'use strict'

const S = require('fluent-schema')

async function signUpService (fastify, opts) {
  fastify.route({
    method: 'POST',
    path: '/signup',
    handler: onSignUp,
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

  async function onSignUp (req, reply) {
    const { username/*, password */ } = req.body

    const token = await reply.jwtSign({ username }, {
      expiresIn: 300 // 5 minute
    })

    // todo store in redis

    return { token }
  }
}

module.exports = signUpService
