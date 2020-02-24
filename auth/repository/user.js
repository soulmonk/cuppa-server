'use strict'

const bcrypt = require('bcrypt')

class UserRepository {

  static async getUserById (pg, id) {
    const client = await pg.connect()
    // tod optimise query
    const { rows } = await client.query('SELECT name as username FROM "user" WHERE id=$1 limit 1', [
      id
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  // todo jsdoc
  static async getUserByName (pg, username) {
    const client = await pg.connect()
    // tod optimise query
    const { rows } = await client.query('SELECT * FROM "user" WHERE name=$1 limit 1', [
      username
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  static crypt (password) {
    return bcrypt.hash(password, this.opts.rounds)
  }

  static async checkPassword (plain, stored) {
    if (!plain || !stored) {
      return false
    }
    return await bcrypt.compare(plain, stored)
  }

  static init (opts) {
    if (this.opts) {
      throw new Error('UserRepository is already initialized')
    }
    this.opts = opts
  }
}

module.exports = UserRepository
