'use strict'

const { test } = require('tap')
const { build, createAndAuthorizeUser } = require('../helper')

test('add transaction', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const date = new Date()

  const gqlQuery = `mutation createTransaction {
  addTransaction(transaction: {
    description: "transaction ${date.toISOString()}"
    amount: 10.5
    type: 2
    card: 1
    info: {blockedAmount: 0.1}
  }) {
    id
    date
  }
}`
  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: gqlQuery
    },
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), {
    data: {
      addTransaction: {
        id: '1',
        date: date.getTime()
      }
    }
  })
})

test('add transaction with date', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const date = new Date()

  const gqlQuery = `mutation createTransaction {
  addTransaction(transaction: {
    description: "transaction ${date.toISOString()}"
    amount: 10.5
    type: 2
    card: 0
    date: null
    currencyCode: ""
  }) {
    id
    date
  }
}`
  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: gqlQuery
    },
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), {
    data: {
      addTransaction: {
        id: '1',
        date: date.getTime()
      }
    }
  })
})
