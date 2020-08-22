'use strict'

const S = require('fluent-schema')

async function tokenService (fastify, opts) {
  const responseSchema = {
    200: S.object()
      .prop('token', S.string())
      .prop('expiresIn', S.number())
  }

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
    response: responseSchema
  }

  // route configuration
  fastify.route({
    method: 'POST',
    path: '/token',
    handler: onGetToken,
    schema: tokenSchema
  })

  const refreshTokenSchema = {
    response: responseSchema
  }

  // route configuration
  fastify.route({
    method: 'POST',
    path: '/refresh-token',
    handler: onRefreshToken,
    schema: refreshTokenSchema
  })

  /**
   * @type {UserRepository}
   */
  const { user: userRepository } = fastify.repositories

  async function generateTokenAndMakeResponse (reply, user, error) {
    const { success, token, refreshToken, expiresIn } = await userRepository.generateToken(user)

    if (!success) {
      return error()
    }

    reply.setCookie(opts.jwt.refreshCookie, refreshToken, {
      httpOnly: true,
      sameSite: 'strict'
      // signed ?
    })

    return { token, expiresIn }
  }

  async function onGetToken (req, reply) {
    req.log.info('onGetToken')
    const { username, password } = req.body

    const error = () => reply.code(400).send({
      type: 'error',
      message: 'wrong username or password'
    })

    const user = await userRepository.getUserByName(username)
    if (!user) {
      return error()
    }

    const validPwd = await userRepository.checkPassword(password, user.password)
    if (!validPwd) {
      return error()
    }

    return generateTokenAndMakeResponse(reply, user, error)
  }

  async function onRefreshToken (req, reply) {
    req.log.info('onRefreshToken')

    const error = () => reply.code(400).send({
      type: 'error',
      message: 'could not verify'
    })

    const refreshToken = req.cookies[opts.jwt.refreshCookie]

    const user = await userRepository.getUserByRefreshToken(refreshToken)

    try {
      return generateTokenAndMakeResponse(reply, user, error)
    } catch (e) {
      console.error(e)
      return error()
    }
  }
}

module.exports = tokenService
