'use strict'

const S = require('fluent-schema')
const { getUserByName } = require('../repository/user')

async function getTokenService (fastify/*, opts */) {
  const tokenSchema = {
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

  // route configuration
  fastify.route({
    method: 'POST',
    path: '/token',
    handler: onGetToken,
    schema: tokenSchema
  })

  async function onGetToken (req, reply) {
    req.log.info('onGetToken')
    const { username/*, password */ } = req.body

    const user = await getUserByName(this.pg, username)

    /*
    * TODO
    * 1) user not found
    * 2) wrong password
    * 3) user - disabled
    * */

    if (!user || !user.enabled) {
      return reply.code(400).send({
        type: 'error',
        message: 'wrong username or password'
      })
    }

    // req.log.info(rows.length, rows[0], 'fetched user')

    const token = await reply.jwtSign({ username }, {
      expiresIn: 300 // 5 minute
    })

    return { token }
  }
}

module.exports = getTokenService
