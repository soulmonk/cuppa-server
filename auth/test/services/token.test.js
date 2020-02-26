'use strict'

const { test } = require('tap')
const { build } = require('../helper')

// TODO mock db ???

test('200 response', async t => {
  const app = await build(t)
  let response = await app.inject({
    method: 'POST',
    url: '/token',
    payload: {
      username: 'soulmonk',
      password: 'noneenon'
    }
  })

  t.strictEqual(response.statusCode, 200)

  const payload = JSON.parse(response.payload)
  t.type(payload.token, 'string')

  response = await app.inject({
    method: 'GET',
    url: '/info',
    headers: {
      Authorization: 'Bearer ' + payload.token
    }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), {
    username: 'soulmonk'
  })
})

test('400 response', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/token',
    payload: {
      username: 'not-found',
      password: 'noneenon'
    }
  })

  t.strictEqual(response.statusCode, 400)
  t.deepEqual(JSON.parse(response.payload), {
    type: 'error',
    message: 'wrong username or password'
  })
})
