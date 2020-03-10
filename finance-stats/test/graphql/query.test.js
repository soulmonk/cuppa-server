'use strict'

const { test } = require('tap')
const { build, TOKEN } = require('../helper')

const transactionRepository = require('../../repository/transaction')
const transactionTypeRepository = require('../../repository/transaction-type')
const cardRepository = require('../../repository/card')
const bankRepository = require('../../repository/bank')
const transactionInfoRepository = require('../../repository/transaction-info')

const sinon = require('sinon')

// TODO sinon vs test_db
test('get all transactions', async t => {
  const app = await build(t)

  const allStub = sinon.stub(transactionRepository, 'all')
  allStub.resolves([{ id: 1 }])

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
      Authorization: 'Bearer ' + TOKEN
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)
  t.deepEqual(payload.data.transactions, [{ id: 1 }])

  allStub.restore()
})
// TODO sinon vs test_db
test('get all transactions full', async t => {
  const app = await build(t)

  const transactionStub = sinon.stub(transactionRepository, 'all')
  transactionStub.resolves(
    [
      {
        id: 1,
        date: new Date(1500000000000),
        description: 'transaction',
        amount: 10.5,
        type_id: 2,
        note: '',
        currency_code: 'EUR',
        card_id: 1
      }
    ]
  )

  const infoStub = sinon.stub(transactionInfoRepository, 'byTransactionIds')
  infoStub.resolves(
    [
      {
        id: 1,
        blocked_amount: 10.5,
        fixed_amount: 10.5,
        currency_exchange: 0.99,
        transaction_id: 1
      }
    ]
  )

  const cardStub = sinon.stub(cardRepository, 'byIds')
  cardStub.resolves(
    [
      {
        id: 1,
        name: 'USD',
        valid_from: new Date(1500000000000),
        valid_to: new Date(1500036000000),
        currency_code: 'USD',
        bank_id: 1
      }
    ]
  )

  const typeStub = sinon.stub(transactionTypeRepository, 'byIds')
  typeStub.resolves(
    [
      {
        id: 2,
        name: 'Food',
        description: null
      }
    ]
  )

  const bankStub = sinon.stub(bankRepository, 'byIds')
  bankStub.resolves(
    [
      {
        id: 1,
        name: 'my bank',
        url: 'https://example.com'
      }
    ]
  )

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
      Authorization: 'Bearer ' + TOKEN
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

  t.ok(infoStub.calledWithExactly(app.pg, ['1']))
  t.ok(bankStub.calledWithExactly(app.pg, 8, ['1']))
  t.ok(cardStub.calledWithExactly(app.pg, 8, ['1']))
  t.ok(typeStub.calledWithExactly(app.pg, 8, ['2']))

  transactionStub.restore()
  infoStub.restore()
  typeStub.restore()
  cardStub.restore()
  bankStub.restore()
})

test('get transaction types', async t => {
  const app = await build(t)

  const allStub = sinon.stub(transactionTypeRepository, 'all')
  allStub.resolves([{ id: 1, name: 'Other', description: null }])

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
      Authorization: 'Bearer ' + TOKEN
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)

  t.deepEqual(payload.data.transactionTypes, [{ id: '1', name: 'Other', description: null }])
  allStub.restore()
})

test('get transaction types', async t => {
  const app = await build(t)

  const allStub = sinon.stub(transactionTypeRepository, 'all')
  allStub.resolves([{ id: 1, name: 'Other', description: null }])

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
      Authorization: 'Bearer ' + TOKEN
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)

  t.deepEqual(payload.data.transactionTypes, [{ id: '1', name: 'Other', description: null }])
  allStub.restore()
})

test('get transaction types', async t => {
  const app = await build(t)

  const allStub = sinon.stub(cardRepository, 'all')
  allStub.resolves(
    [
      {
        id: 1,
        name: 'USD',
        valid_from: new Date(1500000000000),
        valid_to: new Date(1500036000000),
        currency_code: 'USD',
        bank_id: 1
      }
    ]
  )

  const bankStub = sinon.stub(bankRepository, 'byIds')
  bankStub.resolves(
    [
      {
        id: 1,
        name: 'my bank',
        url: 'https://example.com'
      }
    ]
  )

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
      Authorization: 'Bearer ' + TOKEN
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
  allStub.restore()
  bankStub.restore()
})
