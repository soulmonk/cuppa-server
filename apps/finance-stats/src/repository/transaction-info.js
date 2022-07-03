'use strict'

const BaseRepository = require('./base')

class TransactionInfoRepository extends BaseRepository {
  static tableName = 'transaction_info'

  static mapFields = {
    blocked_amount: 'blockedAmount',
    fixed_amount: 'fixedAmount',
    currency_exchange: 'currencyExchange'
  }

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }

  static async byTransactionIds (pg, ids) {
    const client = await pg.connect()

    let single = false
    if (!Array.isArray(ids)) {
      single = true
      ids = [ids]
    }

    let where = 'transaction_id = $1'
    if (ids.length > 1) {
      // TODO test `id in (...$i)` vs (string_to_array($1, ','))
      const queryParams = ids.map((_, i) => `$${i + 1}`)
      where = `transaction_id in (${queryParams.join(',')})`
    }

    const { rows } = await this._select(client, { where, params: ids })
    client.release()

    let res = rows
    if (!rows || !rows.length) {
      res = []
    }

    return single ? res[0] : res
  }

  static async create (pg, info) {
    const query = 'INSERT INTO "transaction_info" ("blocked_amount", "fixed_amount", "transaction_id") VALUES ($1, $2, $3) RETURNING id'

    const params = [
      info.blockedAmount,
      info.fixedAmount,
      info.transactionId
    ]

    const { rows } = await pg.query(query, params)

    return rows[0].id
    // RETURNING id
  }
}

module.exports = TransactionInfoRepository
