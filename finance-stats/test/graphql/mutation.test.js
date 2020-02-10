'use strict'

const { test } = require('tap')
const { build } = require('../helper')

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

  // todo should called with

  transactionCreateStub.restore()
  transactionInfoCreateStub.restore()
})
