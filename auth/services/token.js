'use strict'

const S = require('fluent-schema')
const UserRepository = require('../repository/user')

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

  /**
   *
   * @param reply
   * @param pg
   * @param {JWT} jwt
   * @param jwtOpts
   * @param user
   * @param error
   * @returns {Promise<{expiresIn: *, token: *}|*>}
   */
  async function generateTokenAndMakeResponse (reply, pg, jwt, jwtOpts, user, error) {
    const { success, token, refreshToken, expiresIn } = await UserRepository.generateToken(pg, jwt, jwtOpts, user)

    if (!success) {
      return error()
    }

    reply.setCookie(jwtOpts.refreshCookie, refreshToken, {
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

    const user = await UserRepository.getUserByName(this.pg, username)
    if (!user) {
      return error()
    }

    const validPwd = await UserRepository.checkPassword(password, user.password)
    if (!validPwd) {
      return error()
    }

    return generateTokenAndMakeResponse(reply, this.pg, this.jwt, opts.jwt, user, error)
  }

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

  async function onRefreshToken (req, reply) {
    req.log.info('onRefreshToken')

    const error = () => reply.code(400).send({
      type: 'error',
      message: 'could not verify'
    })

    const refreshToken = req.cookies[opts.jwt.refreshCookie]

    const user = await UserRepository.getUserByRefreshToken(this.pg, refreshToken)

    try {
      return generateTokenAndMakeResponse(reply, this.pg, this.jwt, opts.jwt, user, error)
    } catch (e) {
      console.error(e)
      return error()
    }
  }
}

module.exports = tokenService
