'use strict'

const { test } = require('tap')
const { build } = require('../helper')

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
