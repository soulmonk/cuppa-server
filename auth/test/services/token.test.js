'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('token login', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/token',
    body: {
      username: 'admin',
      password: 'q1w2e3r4'
    }
  })

  t.strictEqual(response.statusCode, 200)

  const payload = JSON.parse(response.payload)

  const cookie = response.headers['set-cookie'].split(';')

  t.equal(cookie[0].split('=')[0], 'my_refresh_token')
  t.equal(cookie[1].trim(), 'HttpOnly')
  t.equal(cookie[2].trim(), 'SameSite=Strict')

  const token = payload.token

  const climes = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'))

  t.equal(climes.id, 8)
  t.equal(payload.expiresIn, 100)
})

test('update token via refresh token', async t => {
  const app = await build(t)
  let response = await app.inject({
    method: 'POST',
    url: '/token',
    body: {
      username: 'admin',
      password: 'q1w2e3r4'
    }
  })

  t.strictEqual(response.statusCode, 200)

  let payload = JSON.parse(response.payload)

  let cookie = response.headers['set-cookie'].split(';')
  const refreshInfo = cookie[0].split('=')
  const refreshToken = refreshInfo[1]
  t.equal(refreshInfo[0], 'my_refresh_token')
  t.equal(payload.expiresIn, 100)

  response = await app.inject({
    method: 'POST',
    url: '/refresh-token',
    headers: {
      cookie: 'my_refresh_token=' + refreshToken
    }
  })

  t.strictEqual(response.statusCode, 200)

  payload = JSON.parse(response.payload)
  t.equal(payload.expiresIn, 100)
  cookie = response.headers['set-cookie'].split(';')
  t.equal(cookie[0].split('=')[0], 'my_refresh_token')

  t.ok(payload.token.length)
})
