'use strict'

// TODO rewrite from static
class BaseRepository {
  static tableName = ''
  static mapFields = null

  static async _select (client, { where = '', params = [], fields = [] }) {
    let query = 'SELECT '
    if (fields.length) {
      query += `"${fields.join('", "')}"`
    } else {
      query += '*'
    }

    query += ` FROM "${this.tableName}"`

    if (where.length) {
      query += ` WHERE ${where}`
    }

    // TODO add logger
    console.log('query: ', query, '\nparams: ', params)

    return client.query(query, params)
  }

  static async byId (pg, userId, id) {
    if (undefined === id) {
      return null
    }
    const result = await this.byIds(pg, userId, [id])
    return undefined === result[0] ? null : result[0]
  }

  static async byIds (pg, userId, ids) {
    if (!ids || !ids.length) {
      return []
    }

    if (!Array.isArray(ids)) {
      throw new Error('expected "ids" to be an array')
    }

    // todo duplicate lines
    const client = await pg.connect()

    // todo ??? split to functions
    let where = 'id = $1'
    if (ids.length > 1) {
      // TODO test `id in (...$i)` vs (string_to_array($1, ','))
      const queryParams = ids.map((_, i) => `$${i + 1}`)
      where = `id in (${queryParams.join(',')})`
    }

    where += ' and user_id = $' + (ids.length + 1)

    // todo optimise query (instead "*" specific fields from request)
    const { rows } = await this._select(client, { where, params: ids.concat(userId) })

    client.release()

    let res = rows
    if (!rows || !rows.length) {
      res = []
    }
    return res
  }

  static buildWhere (options, params = [], where = []) {
    throw new Error('Not implemented')
  }

  /**
   *
   * @param pg
   * @param {Number} userId
   * @param {Object} [options={}]
   * @param {Number} [options.limit]
   * @param {Number} [options.offset]
   * @returns {Promise<*>}
   */
  static async all (pg, userId, options = {}) {
    // todo duplicate lines
    const client = await pg.connect()

    let query = `SELECT * FROM "${this.tableName}"`

    const { where, params } = this.buildWhere(options, [userId], ['user_id = $1'])

    if (where.length) {
      query += ' WHERE ' + where.join(' and ')
    }

    if (options.limit) {
      params.push(options.limit)
      query += ' LIMIT $' + params.length
    }

    if (options.offset) {
      params.push(options.offset)
      query += ' OFFSET $' + params.length
    }

    console.log('query: ', query)
    console.log('params: ', params)

    // tod optimise query
    const { rows } = await client.query(query, params)
    client.release()

    return rows && rows.length ? rows : []
  }

  static toJson (data) {
    if (!this.mapFields || !data) {
      return data
    }
    const res = { ...data }

    // todo mark1
    for (const key of Object.keys(this.mapFields)) {
      if (res[key] !== undefined) {
        res[this.mapFields[key]] = res[key]
        delete res[key]
      }
    }

    return res
  }
}

module.exports = BaseRepository
