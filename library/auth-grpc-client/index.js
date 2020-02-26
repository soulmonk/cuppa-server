'use strict'

const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

// /Users/vitaliimelnykov/MainFolder/projects/SoulMonk/cuppa/cuppa-workers/authentication/api/proto/v1/authenctication-service.proto
class AuthGrpcClient {

  constructor (protoPath, grpcServerUri, options = {}) {
    this.createClient(protoPath, grpcServerUri)

    this.apiVersion = options.apiVersion
  }

  createClient (protoPath, grpcServerUri) {
    const packageDefinition = protoLoader.loadSync(
      protoPath,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      })

    const v1 = grpc.loadPackageDefinition(packageDefinition).v1
    this.client = new v1.ToDoService(grpcServerUri,
      grpc.credentials.createInsecure())
  }

  toProtobufTimestamp (date) {
    const timeMS = date.getTime()
    return {
      seconds: Math.floor(timeMS / 1000),
      nanos: (timeMS % 1000) * 1e6
    }
  }

  fromProtobufTimestamp (ts) {
    return new Date(+ts.seconds * 1000 + Math.floor(ts.nanos / 1e6))
  }

  login(username, password) {

  }
}

module.exports = AuthGrpcClient
