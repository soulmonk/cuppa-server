module.exports = {
  type: 'object',
  required: ['PORT', 'POSTGRESQL_CONNECTION_STRING', 'JWT_SECRET', 'REDIS_CONNECTION_STRING'],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    },
    JWT_SECRET: {
      type: 'string',
      default: 'secret'
    },
    POSTGRESQL_CONNECTION_STRING: {
      type: 'string',
      default: 'postgres://cuppa:toor@localhost/cuppa-finance-stats'
    },
    REDIS_CONNECTION_STRING: {
      type: 'string',
      default: 'redis://127.0.0.1:6379'
    }
  }
}
