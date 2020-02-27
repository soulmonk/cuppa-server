'use strict'

const { test } = require('tap')
const { build } = require('../helper')

// TODO mock db ???

test('token login', async t => {
  const app = await build(t)
  t.ok(app)
  throw new Error('Not implemented')
})

test('token login with refresh token', async t => {
  throw new Error('Not implemented')
})

test('update token via refresh token', async t => {
  throw new Error('Not implemented')
})
