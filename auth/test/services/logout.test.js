'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('logout should clear cookie and refresh token', async t => {
  const app = await build(t)
  t.ok(app)
  throw new Error('Not implemented')
})
