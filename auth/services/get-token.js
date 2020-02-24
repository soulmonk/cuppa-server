'use strict'

const S = require('fluent-schema')
const UserRepository = require('../repository/user')

async function getTokenService (fastify, opts) {
  const tokenSchema = {
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
      ),
    response: {
      200: S.object()
        .prop('token', S.string())
    }
  }

  // route configuration
  fastify.route({
    method: 'POST',
    path: '/token',
    handler: onGetToken,
    schema: tokenSchema
  })

  async function onGetToken (req, reply) {
    req.log.info('onGetToken')
    const { username, password  } = req.body

    const error = () => reply.code(400).send({
      type: 'error',
      message: 'wrong username or password'
    })

    const user = await UserRepository.getUserByName(this.pg, username)
    if (!user) {
      return error()
    }

    const validPwd = await UserRepository.checkPassword(password, user.password)
    if (!validPwd) {
      return error()
    }

    if (!user || !user.enabled) {
      return error()
    }

    const token = await reply.jwtSign({ id: user.id }, {
      expiresIn: opts.jwt.expiresIn
    })

    return { token }
  }
}

module.exports = getTokenService
