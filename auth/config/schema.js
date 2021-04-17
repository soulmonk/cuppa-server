module.exports = {
  type: 'object',
  required: ['PORT', 'POSTGRESQL_CONNECTION_STRING', 'JWT_SECRET'],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    },
    JWT_SECRET: {
      type: 'string',
      default: 'secret'
    },
    JWT_EXPIRES_IN: {
      type: 'number',
      default: 900
    },
    JWT_REFRESH_EXPIRES_IN: {
      type: 'number',
      default: 86400
    },
    JWT_REFRESH_COOKIE: {
      type: 'string',
      default: 'refresh_token'
    },
    USER_ROUNDS: {
      type: 'number',
      default: 10
    },
    POSTGRESQL_CONNECTION_STRING: {
      type: 'string',
      default: 'postgres://cuppa:toor@localhost/cuppa-authentication'
    },
    COOKIE_SECRET: {
      type: 'string',
      default: 'my-secret'
    }
  }
}
