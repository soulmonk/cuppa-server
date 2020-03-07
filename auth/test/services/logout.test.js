'use strict'

const { test } = require('tap')
const { build } = require('../helper')
const sinon = require('sinon')

test('logout should clear cookie and refresh token', async t => {
  const app = await build(t)

  const stubSetRefreshToken = sinon.stub(app.repositories.user, 'storeRefreshToken')
  stubSetRefreshToken.resolves()

  const token = await app.jwt.sign({ id: 2 })

  const response = await app.inject({
    method: 'POST',
    url: '/logout',
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.strictEqual(response.statusCode, 200)

  t.ok(stubSetRefreshToken.calledOnce)
  t.ok(stubSetRefreshToken.calledWithExactly(2, null))
  stubSetRefreshToken.restore()
})
