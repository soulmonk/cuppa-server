'use strict'

const votes = []
let lastId = 0
const VOTE_ADDED = 'VOTE_ADDED'

const resolvers = {
  Query: {
    votes: async () => votes
  },
  Mutation: {
    addVote: async (_, { title }) => {
      const vote = {
        id: ++lastId,
        title,
        ayes: 0,
        noes: 0
      }
      votes.push(vote)
      return vote
    },
    voteAye: async (_, { voteId }, { pubsub }) => {
      if (voteId <= votes.length) {
        votes[voteId - 1].ayes++
        await pubsub.publish(
          {
            topic: `${VOTE_ADDED}_${voteId}`,
            payload: {
              voteAdded: votes[voteId - 1]
            }
          }
        )

        return votes[voteId - 1]
      }

      throw new Error('Invalid vote id')
    },
    voteNo: async (_, { voteId }, { pubsub }) => {
      if (voteId <= votes.length) {
        votes[voteId - 1].noes++
        await pubsub.publish(
          {
            topic: `${VOTE_ADDED}_${voteId}`,
            payload: {
              voteAdded: votes[voteId - 1]
            }
          }
        )

        return votes[voteId - 1]
      }

      throw new Error('Invalid vote id')
    }
  },
  Subscription: {
    voteAdded: {
      subscribe: async (root, { voteId }, { pubsub }) => {
        // subscribe only for a vote with a given id
        return pubsub.subscribe(`${VOTE_ADDED}_${voteId}`)
      }
    }
  }
}

module.exports = resolvers
