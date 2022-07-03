'use strict'

import fp from 'fastify-plugin'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async function (fastify) {
  // @ts-ignore
  fastify.register(import('@fastify/sensible'), {
    errorHandler: true
  })
})
