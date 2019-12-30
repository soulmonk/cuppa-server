'use strict'

module.exports = `
  type Vote {
    id: ID!
    title: String!
    ayes: Int
    noes: Int
  }

  type Query {
    votes: [Vote]
  }

  type Mutation {
    addVote(title: String): Vote
    voteAye(voteId: ID!): Vote
    voteNo(voteId: ID!): Vote
  }

  type Subscription {
    voteAdded(voteId: ID!): Vote
  }

`
