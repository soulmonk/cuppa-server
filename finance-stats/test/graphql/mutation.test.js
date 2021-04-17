'use strict'

const { test } = require('tap')
const { build, TOKEN } = require('../helper')

const transactionRepository = require('../../repository/transaction')
const transactionInfoRepository = require('../../repository/transaction-info')

const sinon = require('sinon')

test('add transaction', async t => {
  const app = await build(t)

  const date = new Date()

  const transactionCreateStub = sinon.stub(transactionRepository, 'create')
  transactionCreateStub.resolves({ id: 1, date })
  const transactionInfoCreateStub = sinon.stub(transactionInfoRepository, 'create')
  transactionInfoCreateStub.resolves({ id: 1 })

  // TODO no internet "Cannot stub non-existent own property "
  // TODO no access to the decorate
  // const authStub = sinon.stub(app, 'authenticate')
  // authStub.fakeFn(req => { req.user = { id: 1 } })
  // authStub.resolves()

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
      Authorization: 'Bearer ' + TOKEN
    }
  })

  t.equal(response.statusCode, 200)
  t.same(JSON.parse(response.payload), {
    data: {
      addTransaction: {
        id: '1',
        date: date.getTime()
      }
    }
  })

  // todo should called with

  // authStub.restore()
  transactionCreateStub.restore()
  transactionInfoCreateStub.restore()
})

test('add transaction with date', async t => {
  const app = await build(t)

  const date = new Date()

  const transactionCreateStub = sinon.stub(transactionRepository, 'create')
  transactionCreateStub.resolves({ id: 1, date })
  const transactionInfoCreateStub = sinon.stub(transactionInfoRepository, 'create')
  transactionInfoCreateStub.resolves({ id: 1 })

  // TODO no internet "Cannot stub non-existent own property "
  // TODO no access to the decorate
  // const authStub = sinon.stub(app, 'authenticate')
  // authStub.fakeFn(req => { req.user = { id: 1 } })
  // authStub.resolves()

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
      Authorization: 'Bearer ' + TOKEN
    }
  })

  t.equal(response.statusCode, 200)
  t.same(JSON.parse(response.payload), {
    data: {
      addTransaction: {
        id: '1',
        date: date.getTime()
      }
    }
  })

  t.same(transactionCreateStub.getCall(0).args[1], {
    date: 'now()',
    description: `transaction ${date.toISOString()}`,
    amount: 10.5,
    type_id: 2,
    note: '',
    currency_code: 'UAH', // DEFAULT
    card_id: null,
    user_id: 8
  })

  // todo should called with

  // authStub.restore()
  transactionCreateStub.restore()
  transactionInfoCreateStub.restore()
})
