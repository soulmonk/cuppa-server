'use strict'

import bcrypt from 'bcrypt'
import hyperid from 'hyperid'

class UserRepository {
  constructor (pg, jwt, jwtOpts, userOpts) {
    this.pg = pg
    this.jwt = jwt
    this.jwtOpts = jwtOpts
    this.userOpts = userOpts
  }

  async getUserById (id) {
    if (id === null || isNaN(Number(id))) {
      throw new Error('invalid arguments: id is required')
    }
    const client = await this.pg.connect()
    // todo optimise query
    const { rows } = await client.query('SELECT * FROM "user" WHERE id=$1 limit 1', [
      id
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  // todo jsdoc
  async getUserByName (username) {
    if (username === null || typeof username !== 'string') {
      throw new Error('invalid arguments: username is required')
    }
    const client = await this.pg.connect()
    // todo optimise query
    const { rows } = await client.query('SELECT * FROM "user" WHERE name=$1 limit 1', [
      username
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  async storeRefreshToken (id, token) {
    if (id === null || isNaN(Number(id)) || token === null || typeof token !== 'string') {
      throw new Error('invalid arguments: "id" and "token" are required')
    }
    const client = await this.pg.connect()
    const { rowCount } = await client.query('UPDATE "user" SET refresh_token=$2, updated_at = now() WHERE id=$1', [
      id,
      token
    ])
    client.release()

    return rowCount === 1
  }

  async getUserByRefreshToken (token) {
    if (token === null || typeof token !== 'string') {
      throw new Error('invalid arguments: "token" is required')
    }

    const client = await this.pg.connect()
    // todo optimise query
    const { rows } = await client.query('SELECT id, enabled FROM "user" WHERE refresh_token=$1 limit 1', [
      token
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  async checkPassword (plain, stored) {
    if (!plain || !stored) {
      return false
    }
    return bcrypt.compare(plain, stored)
  }

  async signup (username, password, email, enabled = false) {
    const userModel = await this.getUserByName(username)
    if (userModel) {
      const error = new Error(`user "${username}" exists`)
      // @ts-ignore
      error.code = 'duplicate'
      throw error
    }
    const hashedPass = await bcrypt.hash(password, this.userOpts.rounds)
    const client = await this.pg.connect()
    const { rows } = await client.query(`INSERT INTO "user" (name, email, password, enabled, created_at, updated_at)
    VALUES ($1, $2, $3, $4, now(), now())
        RETURNING id, enabled, created_at, updated_at`, [
      username,
      email,
      hashedPass,
      enabled
    ])
    client.release()

    return rows && rows.length && rows[0]
  }

  async generateToken (user) {
    if (!user || !user.enabled) {
      return { success: false }
    }
    const expiresIn = this.jwtOpts.expiresIn

    const token = await this.jwt.sign({ id: user.id }, {
      expiresIn
    })

    const refreshToken = hyperid().uuid

    await this.storeRefreshToken(user.id, refreshToken)

    return { success: true, token, refreshToken, expiresIn }
  }
}

export default UserRepository
