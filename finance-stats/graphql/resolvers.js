'use strict'

const scalar = require('./scalar')

let lastId = 999999999

const resolvers = {
  ...scalar,
  Query: {
    status: async () => 'OK',
    transactions: async (obj, args, ctx) => {
      const client = await ctx.pg.connect()
      // tod optimise query
      const { rows } = await client.query('SELECT * FROM "transactions"')
      client.release()

      return rows
    },
    total: async (obj, args, ctx) => {
      return []
    }
  },
  Mutation: {
    addTransaction: async (obj, { title }, { pubsub }) => {
      const transaction = {
        id: ++lastId,
        title
      }
      await pubsub.publish(
        {
          topic: `transactionAdded`,
          payload: {
            transaction
          }
        }
      )

      return transaction
    }
  },
  Subscription: {
    transactionAdded: {
      subscribe: async (obj, args, { pubsub }) => {
        return pubsub.subscribe(`transactionAdded`)
      },
      resolve: payload => payload.transaction
    }
  }
}

module.exports = resolvers
