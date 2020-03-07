'use strict'

const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

// TODO security
// /Users/vitaliimelnykov/MainFolder/projects/SoulMonk/cuppa/cuppa-workers/authentication/api/proto/v1/authenctication-service.proto
class AuthGrpcClient {
  constructor (protoPath, grpcServerUri, options = {}) {
    if (!protoPath || !grpcServerUri || !options.apiVersion) {
      throw new Error('"protoPath" and "grpcServerUri" and "options.apiVersion" are required')
    }
    this.createClient(protoPath, grpcServerUri)

    this.apiVersion = options.apiVersion
  }

  createClient (protoPath, grpcServerUri) {
    // todo protoLoader.load promise, async could not be used in constructor
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
    this.client = new v1.AuthenticationService(grpcServerUri,
      grpc.credentials.createInsecure())
  }

  async signup (username, password, email) {
    const payload = {
      api: this.apiVersion,
      username,
      email,
      password
    }
    return new Promise((resolve, reject) => {
      this.client.SignUp(payload, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  async login (username, password) {
    const payload = {
      api: this.apiVersion,
      username,
      password
    }

    return new Promise((resolve, reject) => {
      this.client.Login(payload, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  validate (token) {
    const payload = {
      api: this.apiVersion,
      token
    }
    return new Promise((resolve, reject) => {
      this.client.Validate(payload, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  logout (token) {
    const payload = {
      api: this.apiVersion,
      token
    }
    return new Promise((resolve, reject) => {
      this.client.Logout(payload, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }
}

module.exports = AuthGrpcClient
