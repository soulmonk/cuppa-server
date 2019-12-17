'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
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

  // Make sure to call next when done
  next()
}

/*

if (require.main === module) {
  const fastify = build({
    logger: {
      level: 'info'
    }
  })
  fastify.listen(3000, err => {
    if (err) throw err
    console.log(`Server listening at http://localhost:${fastify.server.address().port}`)
  })
}

module.exports = build
*/
