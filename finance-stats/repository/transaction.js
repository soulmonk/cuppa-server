'use strict'

const BaseRepository = require('./base')

class TransactionRepository extends BaseRepository {
  static tableName = 'transaction'

  static async create(pg, transaction) {
    const query = 'INSERT INTO "transaction" ("date", "description", "amount", "type_id", "note", "currency_code", "card_id", "user_id")' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, date';

    const params = [
      transaction.date,
      transaction.description,
      transaction.amount,
      transaction.type_id,
      transaction.note,
      transaction.currency_code,
      transaction.card_id,
      transaction.user_id,
    ]

    console.log('transaction.js::create::24 >>>', '\nquery: ', query, '\nparams: ', params, '\nEND')

    const { rows } = await pg.query(query, params)

    console.log('transaction.js::create::25 >>>', rows)

    return {...transaction, ...rows[0]}
  }

  static buildWhere (options, params = [], where = []) {
    if (options.dateFrom) {
      params.push(options.dateFrom)
      where.push('date > $' + params.length)
    }
    if (options.dateTo) {
      params.push(options.dateTo)
      where.push('date < $' + params.length)
    }

    return {
      params,
      where
    }
  }
}

module.exports = TransactionRepository
