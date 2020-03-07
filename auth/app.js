'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const loadConfig = require('./config')

async function setup (fastify, opts) {
  // TODO error handler
  // TODO error handler
  // TODO error handler

  // TODO how to override without override
  opts = { ...loadConfig(), ...opts }
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })
}

if (require.main === module) {
  const fastify = require('fastify')({
    logger: {
      level: 'info'
    }
  })
  setup(fastify)
    .then(() => fastify.listen(process.env.FASTIFY_PORT || 3000))
    .then(() => console.log(`Server listening at http://localhost:${fastify.server.address().port}`))
    .catch(err => {
      console.error(err)
    })
}

module.exports = setup
