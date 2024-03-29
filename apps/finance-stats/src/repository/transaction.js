'use strict'
// const moment = require('moment')
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

  static async update (pg, userId, transactionId, data) {
    const inDb = await this.byId(pg, userId, transactionId)
    if (!inDb) {
      throw new Error('Not found')
    }

    const params = [
      transactionId
    ]

    const set = []
    Object.keys(data).reduce((acc, field) => {
      if (data[field] !== null && data[field] !== undefined && data[field] !== inDb[field]) {
        params.push(data[field])
        acc.push(`${field} = $${params.length}`)
      }
      return acc
    }, set)

    if (!set.length) {
      // throw new Error('nothing to update?')
      return
    }
    const query = `UPDATE "transaction"
                   SET ${set.join(',')}
                   WHERE id = $1`
    await pg.query(query, params)
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

  static async total (pg, userId, options = {}) {
    // { dateFrom: moment().subtract(7, 'days').toDate(), dateTo: Date.now() }
    let query = 'SELECT type_id, currency_code, sum(amount) as amount FROM "transaction" WHERE user_id = $1'
    const params = [userId]

    /*
    * if (options.dateFrom && options.dateTo) {
      params.push(options.dateFrom, options.dateTo)
      query += ' and date beetwen'
    } else if (options.dateFrom) {
      params.push(options.dateFrom)
      query += ' and date >= $2'
    } else {
      params.push(options.dateTo)
      query += ' and date <= $2
    }
    * */

    if (options.dateFrom) {
      params.push(options.dateFrom)
      query += ' and date >= $2'
    }
    if (options.dateTo) {
      params.push(options.dateTo)
      query += ' and date <= $' + params.length
    }
    query += ' group by 1,2'
    const { rows } = await pg.query(query, params)
    return rows
  }
}

TransactionRepository.toJson.bind(TransactionRepository)

module.exports = TransactionRepository
