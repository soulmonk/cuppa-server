'use strict'

const S = require('fluent-json-schema')

async function signupService (fastify) {
  const responseSchema = {
    201: S.null(),
    400: S.object()
      .prop('type', S.string())
      .prop('message', S.string())
  }

  const signupSchema = {
    body: S.object()
      .prop('username', S.string()
        .minLength(4)
        .maxLength(128)
        .required()
      )
      .prop('password', S.string()
        .minLength(8)
        .maxLength(128)
        .required()
      )
      .prop('email', S.string()
        .format(S.FORMATS.EMAIL)
        .required()
      ),
    response: responseSchema
  }

  fastify.route({
    method: 'POST',
    path: '/signup',
    handler: onSignup,
    schema: signupSchema
  })

  /**
   * @type {UserRepository}
   */
  const { user: userRepository } = fastify.repositories

  async function onSignup (req, reply) {
    const { log, body: { username, password, email } } = req
    log.info('onSignup')

    try {
      await userRepository.signup(username, password, email, true)
    } catch (err) {
      if (err.code === 'duplicate') {
        return reply.code(400).send({
          type: 'error',
          message: err.message
        })
      }
      throw err
    }

    reply.code(201).send()
  }
}

module.exports = signupService
