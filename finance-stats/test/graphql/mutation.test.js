'use strict'

const { test } = require('tap')
const { build, createAndAuthorizeUser } = require('../helper')

async function qlRequest (app, gqlQuery, token) {
  return app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: gqlQuery
    },
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}

test('add transaction', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const date = new Date()
  let gqlQuery = `mutation createTransactionType {
  addTransactionType(type: {
    name: "type ${date.toISOString()}"
  }) {
    id
    name
  }
}`

  let response = await qlRequest(app, gqlQuery, token)
  t.strictEqual(response.statusCode, 200)

  const payload = JSON.parse(response.payload)
  t.match(payload, {
    data: {
      addTransactionType: {
        id: /\d+/,
        name: `type ${date.toISOString()}`
      }
    }
  })
  const type = payload?.data?.addTransactionType

  const description = `transaction ${date.toISOString()}`

  gqlQuery = `mutation createTransaction {
  addTransaction(transaction: {
    description: "${description}"
    date: "${date.toISOString()}"
    amount: 10.5
    type: ${+type.id}
    info: {blockedAmount: 0.1}
  }) {
    id
    description
    amount
    date
  }
}`
  response = await qlRequest(app, gqlQuery, token)

  t.equal(response.statusCode, 200)
  t.match(JSON.parse(response.payload), {
    data: {
      addTransaction: {
        id: /\d+/,
        description,
        date: date.toISOString(),
        amount: 10.5
      }
    }
  }, response.payload)
})

test('add transaction with date', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const date = new Date()
  let gqlQuery = `mutation createTransactionType {
  addTransactionType(type: {
    name: "type ${date.toISOString()}"
  }) {
    id
    name
  }
}`

  let response = await qlRequest(app, gqlQuery, token)
  t.strictEqual(response.statusCode, 200)

  const payload = JSON.parse(response.payload)
  t.has(payload, {
    data: {
      addTransactionType: {
        name: `type ${date.toISOString()}`
      }
    }
  })
  const type = payload?.data?.addTransactionType

  gqlQuery = `mutation createTransaction {
  addTransaction(transaction: {
    description: "transaction ${date.toISOString()}"
    amount: 10.5
    type: ${+type.id}
    date: null
    currencyCode: ""
  }) {
    id
    description
    amount
    type {
      id
    }
  }
}`
  response = await qlRequest(app, gqlQuery, token)

  t.equal(response.statusCode, 200)
  t.has(JSON.parse(response.payload), {
    data: {
      addTransaction: {
        description: `transaction ${date.toISOString()}`,
        amount: 10.5,
        type: {
          id: type.id
        }
      }
    }
  }, response.payload)
})
