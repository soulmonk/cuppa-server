'use strict'

const { test } = require('tap')
const { build } = require('../helper')

// TODO
test('200 response', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: `{
  transactions {
    id
  }
}`
    }
  })

  t.strictEqual(response.statusCode, 200)
  console.log('query.test.js::::22 >>>',response.payload)
  const payload = JSON.parse(response.payload)
  t.type(payload.data.transactions.length, 'number')
})
