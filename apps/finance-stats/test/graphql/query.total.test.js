'use strict'

const { test } = require('tap')
const { build, createAndAuthorizeUser, getUserIdFrom, getDb } = require('../helper')

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

function map (arr, keyProp, valueProp) {
  return arr.reduce((acc, row) => {
    acc[row[keyProp]] = row[valueProp]
    return acc
  }, {})
}

async function baseUserMockData (userId, db) {
  const query = `INSERT INTO bank (name, url, user_id)
                 VALUES ('bank', null, $1)
                 RETURNING id;`
  const { rows: [{ id: bankId }] } = await db.query(query, [userId])

  const { rows: cards } = await db.query(`INSERT INTO card (name, valid_from, valid_to, currency_code, bank_id, description, user_id)
                                          VALUES ('UAH', $4, $3, 'UAH', $2, null, $1),
                                                 ('USD', $4, $3, 'USD', $2, null, $1),
                                                 ('EUR', $4, $3, 'EUR', $2, null, $1)
                                          RETURNING id, name;
  `, [userId, bankId, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)])

  const cardsMap = map(cards, 'name', 'id')

  const { rows: types } = await db.query(`INSERT INTO "transaction_type" ("name", "description", "user_id")
                                          VALUES ('General', null, $1),
                                                 ('Other', null, $1)
                                          RETURNING id, name`, [userId])

  const typesMap = map(types, 'name', 'id')

  return {
    userId,
    bankId,
    cards: cardsMap,
    types: typesMap
  }
}

test('query total', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const userId = getUserIdFrom(token)
  const db = getDb(t)
  const { types } = await baseUserMockData(userId, db)

  const addTransactionsQuery = `INSERT INTO "transaction" ("date", "description", "amount", "type_id", "note", "currency_code", "card_id", "user_id")
      VALUES (now(), 'General 1', 25, ${types.General}, '', 'USD', null, $1),
      (now(), 'General 1', 25, ${types.General}, '', 'USD', null, $1),
      (now(), 'General 3', 20, ${types.General}, '', 'USD', null, $1),
      (now(), 'General 4', 30, ${types.General}, '', 'USD', null, $1),
      (now(), 'General 1', 25, ${types.Other}, '', 'USD', null, $1),
      (now(), 'General 2', 25, ${types.Other}, '', 'USD', null, $1),
      (now(), 'General 3', 25, ${types.Other}, '', 'USD', null, $1);`

  await db.query(addTransactionsQuery, [userId])

  const date = new Date()
  const gqlQueryTotal = `query total {
  total {
    type {
      id
      name
    }
    amount
  }
}`

  let response = await qlRequest(app, gqlQueryTotal, token)
  t.strictEqual(response.statusCode, 200)

  const payload = JSON.parse(response.payload)
  t.match(payload, {
    data: {
      total: [
        {
          type: {
            name: 'General'
          },
          amount: 100
        }, {
          type: {
            name: 'Other'
          },
          amount: 75
        }]
    }
  })

  const gqlCreateTransactionQuery = `mutation createTransaction {
  addTransaction(transaction: {
    description: "General 5"
    date: "${date.toISOString()}"
    amount: 10.5
    type: ${types.General}
  }) {
    id
    description
    amount
    date
  }
}`
  response = await qlRequest(app, gqlCreateTransactionQuery, token)

  t.strictEqual(response.statusCode, 200)
  t.match(JSON.parse(response.payload), {
    data: {
      addTransaction: {
        description: 'General 5',
        date: date.toISOString(),
        amount: 10.5
      }
    }
  }, response.payload)

  response = await qlRequest(app, gqlQueryTotal, token)
  t.strictEqual(response.statusCode, 200)
  t.match(JSON.parse(response.payload), {
    data: {
      total: [
        {
          type: {
            name: 'General'
          },
          amount: 110.5
        }, {
          type: {
            name: 'Other'
          },
          amount: 75
        }]
    }
  })
})

test('query total filter by dates', async t => {
  const app = await build(t)
  const token = await createAndAuthorizeUser()

  const userId = getUserIdFrom(token)
  const db = getDb(t)
  const { types } = await baseUserMockData(userId, db)

  const addTransactionsQuery = `INSERT INTO "transaction" ("date", "description", "amount", "type_id", "note", "currency_code", "card_id", "user_id")
      VALUES ('2020-10-01T00:00:00.0000', 'General 1', 25, ${types.General}, '', 'USD', null, $1),
      ('2020-09-01T00:00:00.0000', 'General 1', 25, ${types.General}, '', 'USD', null, $1),
      ('2020-10-24T00:00:00.0000', 'General 3', 20, ${types.General}, '', 'USD', null, $1),
      ('2020-10-05T00:00:00.0000', 'General 4', 30, ${types.General}, '', 'USD', null, $1),
      ('2020-09-01T00:00:00.0000', 'Other 1', 25, ${types.Other}, '', 'USD', null, $1),
      ('2020-10-05T00:00:00.0000', 'Other 2', 22, ${types.Other}, '', 'USD', null, $1),
      ('2020-10-20T00:00:00.0000', 'Other 3', 25, ${types.Other}, '', 'USD', null, $1);`

  const dateFrom = new Date('2020-10-01T00:00:00.0000')
  const dateTo = new Date('2020-10-10T00:00:00.0000')

  await db.query(addTransactionsQuery, [userId])

  // const date = new Date()
  const gqlQueryTotal = `query total {
  total(dateFrom: ${dateFrom.toISOString()}, dateTo: ${dateTo.toISOString()}) {
    type {
      id
      name
    }
    amount
  }
}`

  const response = await qlRequest(app, gqlQueryTotal, token)
  t.strictEqual(response.statusCode, 200)

  const payload = JSON.parse(response.payload)
  t.match(payload, {
    data: {
      total: [
        {
          type: {
            name: 'General'
          },
          amount: 55
        }, {
          type: {
            name: 'Other'
          },
          amount: 22
        }]
    }
  })
})

test('different users', async t => {
  const app = await build(t)
  const token1 = await createAndAuthorizeUser()
  const token2 = await createAndAuthorizeUser()

  const userId1 = getUserIdFrom(token1)
  const userId2 = getUserIdFrom(token2)
  const db = getDb(t)
  const { types: types1 } = await baseUserMockData(userId1, db)
  const { types: types2 } = await baseUserMockData(userId2, db)

  const addTransactionsQuery = `INSERT INTO "transaction" ("date", "description", "amount", "type_id", "note", "currency_code", "card_id", "user_id")
      VALUES ('2020-10-01T00:00:00.0000', 'General 1', 25, ${types.General}, '', 'USD', null, $1),
      ('2020-09-01T00:00:00.0000', 'General 1', 25, ${types.General}, '', 'USD', null, $1),
      ('2020-10-24T00:00:00.0000', 'General 3', 20, ${types.General}, '', 'USD', null, $1),
      ('2020-10-05T00:00:00.0000', 'General 4', 30, ${types.General}, '', 'USD', null, $1),
      ('2020-09-01T00:00:00.0000', 'Other 1', 25, ${types.Other}, '', 'USD', null, $1),
      ('2020-10-05T00:00:00.0000', 'Other 2', 22, ${types.Other}, '', 'USD', null, $1),
      ('2020-10-20T00:00:00.0000', 'Other 3', 25, ${types.Other}, '', 'USD', null, $1);`

  const dateFrom = new Date('2020-10-01T00:00:00.0000')
  const dateTo = new Date('2020-10-10T00:00:00.0000')

  await db.query(addTransactionsQuery, [userId])

  // const date = new Date()
  const gqlQueryTotal = `query total {
  total(dateFrom: ${dateFrom.toISOString()}, dateTo: ${dateTo.toISOString()}) {
    type {
      id
      name
    }
    amount
  }
}`

  const response = await qlRequest(app, gqlQueryTotal, token)
  t.strictEqual(response.statusCode, 200)

  const payload = JSON.parse(response.payload)
  t.match(payload, {
    data: {
      total: [
        {
          type: {
            name: 'General'
          },
          amount: 55
        }, {
          type: {
            name: 'Other'
          },
          amount: 22
        }]
    }
  })
})

// Buffer.from('eyJpZCI6MSwiaWF0IjoxNjAzNjEzMjQ0LCJleHAiOjE2MDM2MTQxNDR9', 'base64').toString()
