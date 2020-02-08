'use strict'

const { test } = require('tap')
const { build } = require('../helper')

// TODO dependency on db
test('get all transactions', async t => {
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
  const payload = JSON.parse(response.payload)
  t.type(payload.data.transactions.length, 'number')
})

test('get transaction types', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: `{
  transactionTypes {
    id
    name
    description
  }
}`
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)
  const transactionType = payload.data.transactionTypes.find(({ id }) => id === '1')

  t.equal(transactionType !== undefined, true)
  t.deepEqual(transactionType, { id: '1', name: 'Other', description: null })
})
