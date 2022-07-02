'use strict'

const { test } = require('tap')
const { build, createAndAuthorizeUser } = require('../helper')

test('200 response', async t => {
  const app = await build(t)
  // todo for now
  const token = await createAndAuthorizeUser()

  const response = await app.inject({
    method: 'GET',
    url: '/status',
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.equal(response.statusCode, 200)
  t.same(JSON.parse(response.payload), { status: 'ok' })
})
