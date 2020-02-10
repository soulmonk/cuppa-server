'use strict'

const { test } = require('tap')
const sinon = require('sinon')
const transactionInfoRepository = require('../../repository/transaction-info')

test('should create transaction info', async t => {
  const pg = {
    query: sinon.stub().resolves({ rows: [{ id: 1 }] })
  }

  const data = {
    blocked_amount: 0.01,
    fixed_amount: 0.02,
    transaction_id: 1
  }

  const result = await transactionInfoRepository.create(pg, data)

  const query = 'INSERT INTO "transaction_info" ("blocked_amount", "fixed_amount", "transaction_id")' +
    ' VALUES ($1, $2, $3) RETURNING id'
  const params = [0.01, 0.02, 1]
  t.ok(pg.query.calledWithExactly(query, params))

  t.equal(result, 1)
})

test('find by transaction ids', async t => {
  const client = {
    query: sinon.stub().resolves({ rows: [{ id: 1 }] }),
    release: sinon.stub().returns()
  }
  const pg = {
    connect: sinon.stub().resolves(client)
  }

  const ids = [1, 2]

  const result = await transactionInfoRepository.byTransactionIds(pg, ids)
  t.deepEqual(result, [{ id: 1 }])

  t.ok(pg.connect.calledOnce)

  const query = 'SELECT * FROM "transaction_info" WHERE transaction_id in ($1,$2)'
  const params = [1, 2]
  t.ok(client.query.calledWithExactly(query, params))
})
