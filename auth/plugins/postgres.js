'use strict'

const fp = require('fastify-plugin')
const postgres = require('fastify-postgres')

const UserRepository = require('./../repository/user')

async function fastifyPostgres (fastify, opts) {
  // TODO may be move to single plugin for initialization of all repository
  UserRepository.init(opts.user)

  fastify.register(postgres, opts.pg)
}

module.exports = fp(fastifyPostgres)
