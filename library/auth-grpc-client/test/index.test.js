'use strict'

const { test } = require('tap')
const sinon = require('sinon')
const AuthGrpcClient = require('../src/index')

function createClient () {
  return new AuthGrpcClient(process.env.PROTO_PATH, 'localhost:9090', { apiVersion: 'v1' })
}

test('constructor should have required fields', async t => {
  try {
    const client = new AuthGrpcClient()
    t.ok(client === undefined, 'Expected error')
  } catch (e) {
    t.ok(e.message === '"protoPath" and "grpcServerUri" and "options.apiVersion" are required')
  }
})

test('login successful', async t => {
  const client = createClient()

  const stub = sinon.stub(client.client, 'Login').callsFake(function (_, cb) {
    cb(null, { api: 'v1', token: 'some_generated_token' })
  })

  const result = await client.login('admin', 'q1w2e3r4')

  t.same(result, { api: 'v1', token: 'some_generated_token' })
  sinon.assert.calledOnce(stub)
  sinon.assert.calledWith(stub, { api: 'v1', username: 'admin', password: 'q1w2e3r4' })

  stub.restore()
})

test('login error', async t => {
  const client = createClient()

  const stub = sinon.stub(client.client, 'Login').callsFake(function (_, cb) {
    cb(new Error('some error'))
  })

  try {
    await client.login('admin', 'q1w2e3r4')
    t.ok(false, 'Expected error')
  } catch (e) {
    t.ok(e.message === 'some error')
  }
  stub.restore()
})

test('validate successful', async t => {
  const client = createClient()

  const stub = sinon.stub(client.client, 'Validate').callsFake(function (_, cb) {
    cb(null, { api: 'v1', id: 999 })
  })

  const result = await client.validate('some_generated_token')

  t.same(result, { api: 'v1', id: 999 })
  sinon.assert.calledOnce(stub)
  sinon.assert.calledWith(stub, { api: 'v1', token: 'some_generated_token' })

  stub.restore()
})

test('validate error', async t => {
  const client = createClient()

  const stub = sinon.stub(client.client, 'Validate').callsFake(function (_, cb) {
    cb(new Error('some error'))
  })

  try {
    await client.validate('some token')
    t.ok(false, 'Expected error')
  } catch (e) {
    t.ok(e.message === 'some error')
  }
  stub.restore()
})
