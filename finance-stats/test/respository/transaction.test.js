'use strict'

const { test } = require('tap')
const sinon = require('sinon')
const transactionRepository = require('../../repository/transaction')

test('should create transaction', async t => {
  const date = Date.now()
  const pg = {
    query: sinon.stub().resolves({ rows: [{ id: 1, date }] })
  }

  const transaction = {
    date: 'now()',
    description: 'none',
    amount: 0.01,
    type_id: 1,
    note: 'no',
    currency_code: 'UAH',
    card_id: null,
    user_id: 1
  }

  const result = await transactionRepository.create(pg, transaction)

  const query = 'INSERT INTO "transaction" ("date", "description", "amount", "type_id", "note", "currency_code", "card_id", "user_id")' +
    ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, date'
  const params = ['now()', 'none', 0.01, 1, 'no', 'UAH', null, 1]
  t.ok(pg.query.calledWithExactly(query, params))

  t.equal(result.id, 1)
  t.equal(result.date, date)
})

test('find all transaction', async t => {
  const client = {
    query: sinon.stub().resolves({ rows: [{ id: 1 }] }),
    release: sinon.stub().returns()
  }
  const pg = {
    connect: sinon.stub().resolves(client)
  }

  const result = await transactionRepository.all(pg)
  t.deepEqual(result, [{ id: 1 }])

  t.ok(pg.connect.calledOnce)
})

test('find all transaction with filters', async t => {
  const client = {
    query: sinon.stub().resolves({ rows: [{ id: 1 }] }),
    release: sinon.stub().returns()
  }
  const pg = {
    connect: sinon.stub().resolves(client)
  }

  const date = new Date()

  const options = {
    dateFrom: date,
    dateTo: date,
    limit: 10,
    offset: 5
  }

  const result = await transactionRepository.all(pg, options)
  t.deepEqual(result, [{ id: 1 }])

  t.ok(pg.connect.calledOnce)

  const query = 'SELECT * FROM "transaction" WHERE date > $1 and date < $2 LIMIT $3 OFFSET $4'
  const params = [date, date, 10, 5]
  t.ok(client.query.calledWithExactly(query, params))
})

test('find by ids', async t => {
  const client = {
    query: sinon.stub().resolves({ rows: [{ id: 1 }] }),
    release: sinon.stub().returns()
  }
  const pg = {
    connect: sinon.stub().resolves(client)
  }

  const ids = [1, 2]

  const result = await transactionRepository.byIds(pg, ids)
  t.deepEqual(result, [{ id: 1 }])

  t.ok(pg.connect.calledOnce)

  const query = 'SELECT * FROM "transaction" WHERE id in ($1,$2)'
  const params = [1, 2]
  t.ok(client.query.calledWithExactly(query, params))
})

test('find by id', async t => {
  const client = {
    query: sinon.stub().resolves({ rows: [{ id: 1 }] }),
    release: sinon.stub().returns()
  }
  const pg = {
    connect: sinon.stub().resolves(client)
  }

  const result = await transactionRepository.byId(pg, 1)
  t.deepEqual(result, { id: 1 })

  t.ok(pg.connect.calledOnce)

  const query = 'SELECT * FROM "transaction" WHERE id = $1'
  const params = [1]
  t.ok(client.query.calledWithExactly(query, params))
})

test('build where', async t => {
  const dateFrom = new Date()
  const dateTo = new Date(Date.now() + 1000 * 60)

  test('all params', async t => {
    const { params, where } = transactionRepository.buildWhere({ dateFrom: dateFrom, dateTo: dateTo }, [], [])

    t.deepEqual(params, [dateFrom, dateTo])
    t.deepEqual(where, ['date > $1', 'date < $2'])
  })
  test('date to', async t => {
    const { params, where } = transactionRepository.buildWhere({ dateTo: dateTo }, [], [])

    t.deepEqual(params, [dateTo])
    t.deepEqual(where, ['date < $1'])
  })
  test('date from', async t => {
    const { params, where } = transactionRepository.buildWhere({ dateFrom: dateFrom }, [], [])

    t.deepEqual(params, [dateFrom])
    t.deepEqual(where, ['date > $1'])
  })

  test('no params', async t => {
    const { params, where } = transactionRepository.buildWhere()

    t.deepEqual(params, [])
    t.deepEqual(where, [])
  })
})
