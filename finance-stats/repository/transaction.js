'use strict'

const BaseRepository = require('./base')

// TODO rewrite from static
class TransactionRepository extends BaseRepository {
  static tableName = 'transaction'

  static mapFields = { currency_code: 'currencyCode' }

  static async create (pg, transaction) {
    const query = 'INSERT INTO "transaction" ("date", "description", "amount", "type_id", "note", "currency_code", "card_id", "user_id")' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, date'

    const params = [
      transaction.date,
      transaction.description,
      transaction.amount,
      transaction.type_id,
      transaction.note,
      transaction.currency_code,
      transaction.card_id,
      transaction.user_id
    ]

    const { rows } = await pg.query(query, params)

    return { ...transaction, ...rows[0] }
  }

  /**
   *
   * @param {Object} [options={}]
   * @param {Date} [options.dateFrom]
   * @param {Date} [options.dateTo]
   * @param params
   * @param where
   * @returns {{where: *[], params: *[]}}
   */
  static buildWhere (options = {}, params = [], where = []) {
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

TransactionRepository.toJson.bind(TransactionRepository)

module.exports = TransactionRepository
