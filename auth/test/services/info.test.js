'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('200 response', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/info',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNvdWxtb25rIiwiaWF0IjoxNTc2NTEzMjQ4fQ.oj0R44dTgrV-Jv2JmPwzY4dPg6HNbL2saxjUxfeX_Wc'
    }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), {
    username: 'soulmonk'
  })
})

test('401', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/info',
    headers: {
      Authorization: 'Bearer none'
    }
  })

  t.strictEqual(response.statusCode, 401)
})
