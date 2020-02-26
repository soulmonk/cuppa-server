'use strict'

const bcrypt = require('bcrypt')
const hyperid = require('hyperid')

class UserRepository {
  static async getUserById (pg, id) {
    const client = await pg.connect()
    // todo optimise query
    const { rows } = await client.query('SELECT * FROM "user" WHERE id=$1 limit 1', [
      id
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  // todo jsdoc
  static async getUserByName (pg, username) {
    const client = await pg.connect()
    // todo optimise query
    const { rows } = await client.query('SELECT * FROM "user" WHERE name=$1 limit 1', [
      username
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  static async storeRefreshToken (pg, id, token) {
    const client = await pg.connect()
    // todo optimise query
    const { rowCount } = await client.query('UPDATE "user" SET refresh_token=$2 WHERE id=$1', [
      id,
      token
    ])
    client.release()

    return rowCount === 1
  }

  static async getUserByRefreshToken (pg, token) {
    if (!token) {
      return
    }

    const client = await pg.connect()
    // todo optimise query
    const { rows } = await client.query('SELECT id, enabled FROM "user" WHERE refresh_token=$1 limit 1', [
      token
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
    return bcrypt.compare(plain, stored)
  }

  static init (opts) {
    if (this.opts) {
      throw new Error('UserRepository is already initialized')
    }
    this.opts = opts
  }

  static async generateToken (pg, jwt, jwtOpts, user) {
    if (!user || !user.enabled) {
      return { success: false }
    }

    const token = await jwt.sign({ id: user.id }, {
      expiresIn: jwtOpts.expiresIn
    })

    // todo change key ???
    // jwt.sign
    const refreshToken = hyperid().uuid

    await this.storeRefreshToken(pg, user.id, refreshToken)

    return { success: true, token, refreshToken, expiresIn: jwtOpts.expiresIn }
  }
}

module.exports = UserRepository
