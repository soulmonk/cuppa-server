const AuthGrpcClient = require('../src/index')
const path = require('path')
const fs = require('fs').promises

async function run () {
  console.log('Start', new Date())

  let protoPath = process.env.PROTO_PATH

  if (!protoPath) {
    try {
      protoPath = path.join(__dirname, 'authenctication-service.proto')
      await fs.stat(protoPath)
    } catch (e) {
      protoPath = null
    }
  }

  const client = new AuthGrpcClient(protoPath,  process.env.GRPC_HOST || 'localhost:9090', { apiVersion: 'v1' })

  const [, , username, email, password] = process.argv

  const res = await client.signup(username, password, email);

  console.log('Created user', res)

  console.log('Done', new Date())
}

run().catch(err => (console.error(err), -1)).then(process.exit)
