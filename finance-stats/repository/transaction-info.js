'use strict'

const BaseRepository = require('./base')

class TransactionInfoRepository extends BaseRepository {
  static tableName = 'transaction_info'

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }

  static async byTransactionIds(pg, ids) {
    const client = await pg.connect()

    let single = false
    if (!Array.isArray(ids)) {
      single = true
      ids = [ids]
    }
    // TODO posgresql task1
    let where = ids.length === 1 ? 'transaction_id=$1' : `transaction_id in (${ids.join(',')})`
    // todo multiple ids as parameter
    const params = ids.length === 1 ? ids : []
    // todo optimise query (instead "*" specific fields from request)
    const query = `SELECT * FROM "${this.tableName}" WHERE ${where}`;

    // TODO add logger
    console.log('query: ', query, '\nparams: ', params)
    const { rows } = await client.query(query, params)
    client.release()

    let res = rows
    if (!rows || !rows.length) {
      res = []
    }

    return single ? res[0] : res
  }

  static async create(pg, info) {
    const query = 'INSERT INTO "transaction_info" ("blocked_amount", "fixed_amount", "transaction_id") VALUES ($1, $2, $3) RETURNING id';

    const params = [
      info.blockedAmount,
      info.fixedAmount,
      info.transactionId,
    ]

    console.log('transaction.js::create::24 >>>', '\nquery: ', query, '\nparams: ', params, '\nEND')

    const { rows } = await pg.query(query, params)

    console.log('transaction.js::create::25 >>>', rows)

    return rows[0].id
    // RETURNING id
  }
}

module.exports = TransactionInfoRepository
