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

test('transaction mutation', async t => {
  t.plan(5) //
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
        name: `type ${date.toISOString()}`
      }
    }
  })
  const type = payload?.data?.addTransactionType

  t.spawn('add transaction', async t => {
    const date = new Date()

    const description = `transaction ${date.toISOString()}`

    gqlQuery = `mutation createTransaction {
  addTransaction(transaction: {
    description: "${description}"
    date: ${date.getTime()}
    amount: 10.5
    type: ${+type.id}
    card: 1
    info: {blockedAmount: 0.1}
  }) {
    id
    description
    date
  }
}`
    response = await qlRequest(app, gqlQuery, token)

    t.strictEqual(response.statusCode, 200)
    t.match(JSON.parse(response.payload), {
      data: {
        addTransaction: {
          description,
          date: date.getTime()
        }
      }
    })
  })

  t.spawn('add transaction with date', async t => {
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
    description
    amount
    type {
      id
    }
  }
}`
    const response = qlRequest(app, gqlQuery, token)

    t.strictEqual(response.statusCode, 200)
    t.match(JSON.parse(response.payload), {
      data: {
        addTransaction: {
          description: `transaction ${date.toISOString()}`,
          amount: 10.5,
          type: {
            id: type.id
          }
        }
      }
    })
  })
})
