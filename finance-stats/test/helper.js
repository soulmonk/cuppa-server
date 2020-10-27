'use strict'

process.env.POSTGRESQL_CONNECTION_STRING = process.env.POSTGRESQL_CONNECTION_STRING ||
  'postgres://cuppa:toor@localhost/cuppa-finance-stats-test'
// This file contains code that we reuse
// between our tests.

const { promisify } = require('util')
const wait = promisify(setTimeout)

const fetch = require('node-fetch')

const loadConfig = require('../config')
const pg = require('pg')

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {}
}

// automatically build and tear down our instance
async function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.tearDown(app.close.bind(app))

  await app.ready()

  return app
}

async function createAndAuthorizeUser (username = 'test') {
  await wait(100)
  username += Date.now()
  // todo SERVICE RESOLVER
  const res = await fetch('http://127.0.0.1:3030/signup', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ username, email: `${username}@example.com`, password: '1234567890' })
  })
  if (res.status !== 201) {
    return
  }
  const { token } = await (await fetch('http://127.0.0.1:3030/token', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ username, password: '1234567890' })
  })).json()

  return token
}

function getUserIdFrom (token) {
  const jsonStr = Buffer.from(token.split('.')[1], 'base64').toString()
  return JSON.parse(jsonStr).id
}

const getDb = (t) => {
  const db = new pg.Pool(loadConfig().pg)
  t.tearDown(db.end.bind(db))
  return db
}

module.exports = {
  createAndAuthorizeUser,
  getUserIdFrom,
  getDb,
  config,
  build
}
