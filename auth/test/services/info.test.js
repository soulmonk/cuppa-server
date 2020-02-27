'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('get user info', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/info',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTgyNzg3Nzk5fQ.SKy2WyJbMM1MKD6MIA8rO0BQHUox6X23exuNFYIXQK0'
    }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), {
    username: 'admin'
  })
})

test('401 access deny to get user info', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/info',
    headers: {
      Authorization: 'Bearer none'
    }
  })

  t.strictEqual(response.statusCode, 401)
})
