'use strict'

const resolvers = {
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
  }
}

module.exports = resolvers
