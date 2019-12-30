'use strict'

const resolvers = {
  Query: {
    transactions: async (obj, args, ctx) => {
      const client = await ctx.pg.connect()
      // tod optimise query
      const { rows } = await client.query('SELECT * FROM "transactions"')
      client.release()

      return rows
    }
  }
}

module.exports = resolvers
