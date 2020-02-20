'use strict'

const S = require('fluent-schema')
const path = require('path')

async function statusService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/status',
    handler: onStatus,
    schema: {
      response: {
        200: S.object().prop('status', S.string())
      }
    }
  })

  async function onStatus (req, reply) {
    return { status: 'ok' }
  }
}

async function setup (fastify, opts) {

  fastify.setNotFoundHandler(onMain)

  await statusService(fastify)

  fastify.register(require('fastify-static'), {
    root: path.resolve(process.env.PATH_TO_APP_DIST), // TODO temporary
    prefix: '/', // optional: default '/'
  })

  fastify.route({
    method: 'GET',
    url: '/',
    handler: onMain
  })

  function onMain (req, reply) {
    reply.sendFile('index.html')
  }
}

if (require.main !== module) {
  module.exports = setup
  return
}

const fastify = require('fastify')({
  logger: {
    level: 'info'
  },
})


setup(fastify)
  .then(fastify.listen(3500, '0.0.0.0'))
  .then(() => console.log('Running...'))
