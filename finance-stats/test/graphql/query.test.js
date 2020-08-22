'use strict'

const { test } = require('tap')
const { build, createAndAuthorizeUser } = require('../helper')

test('get all transactions', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: `{
  transactions {
    id
  }
}`
    },
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)
  t.deepEqual(payload.data.transactions, [{ id: 1 }])
})

test('get all transactions full', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const gqlQuery = `query listTransactions {
  transactions {
    id
    date
    description
    amount
    type {
      id
      name
      description
    }
    note
    currencyCode
    card {
      id
      name
      validFrom
      validTo
      currencyCode
      bank {
        id
        name
        url
      }
      description
    }
    info {
      id
      blockedAmount
      fixedAmount
      currencyExchange
    }
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
  const payload = JSON.parse(response.payload)
  t.deepEqual(payload.data.transactions, [
    {
      id: '1',
      date: 1500000000000,
      description: 'transaction',
      amount: 10.5,
      type: {
        id: '2',
        name: 'Food',
        description: null
      },
      note: '',
      currencyCode: 'EUR',
      card: {
        id: '1',
        name: 'USD',
        validFrom: 1500000000000,
        validTo: 1500036000000,
        currencyCode: 'USD',
        bank: {
          id: '1',
          name: 'my bank',
          url: 'https://example.com'
        },
        description: null
      },
      info: {
        id: '1',
        blockedAmount: 10.5,
        fixedAmount: 10.5,
        currencyExchange: 0.99
      }
    }])
})

test('get transaction types', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

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
    },
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)

  t.deepEqual(payload.data.transactionTypes, [{ id: '1', name: 'Other', description: null }])
})

test('get transaction types', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

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
    },
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)

  t.deepEqual(payload.data.transactionTypes, [{ id: '1', name: 'Other', description: null }])
})

test('get transaction types', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: `{
  cards {
    id
    name
    validFrom
    validTo
    description
    currencyCode
    bank {
      name
    }
  }
}`
    },
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)

  t.deepEqual(payload.data.cards, [
    {
      id: '1',
      name: 'USD',
      validFrom: 1500000000000,
      validTo: 1500036000000,
      description: null,
      currencyCode: 'USD',
      bank: {
        name: 'my bank'
      }
    }
  ])
})
