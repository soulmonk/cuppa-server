const AuthGrpcClient = require('../src/index')

async function run () {
  console.log('Start', new Date())

  const client = new AuthGrpcClient(process.env.PROTO_PATH, 'localhost:9090', { apiVersion: 'v1' })

  const [, , username, email, password] = process.argv

  const res = await client.signup(username, password, email);

  console.log('Created user', res)

  console.log('Done', new Date())
}

run().catch(err => (console.error(err), -1)).then(process.exit)
