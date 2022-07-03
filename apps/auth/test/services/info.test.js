'use strict'

const { test } = require('tap')
const { build } = require('../helper')
const sinon = require('sinon')

test('get user info', async t => {
  const app = await build(t)

  const stubFindUser = sinon.stub(app.repositories.user, 'getUserById')
  stubFindUser.resolves({ name: 'admin' })

  const token = await app.jwt.sign({ id: 2 })

  const response = await app.inject({
    method: 'GET',
    url: '/info',
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  t.equal(response.statusCode, 200)
  t.same(JSON.parse(response.payload), {
    username: 'admin'
  })
})

test('401 access deny to get user info', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/info',
    headers: {
      Authorization: 'Bearer none'
    }
  })

  t.equal(response.statusCode, 401)
})
