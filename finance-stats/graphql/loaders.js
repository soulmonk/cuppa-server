'use strict'

module.exports = {
  Transaction: {
    async currency () {
      console.log('Transaction.currency')
      return []
    },
    async type () {
      console.log('Transaction.type')
      return []
    },
    async card () {
      console.log('Transaction.card')
      return []
    },
    async info () {
      console.log('Transaction.info')
      return []
    }
  },
  Card: {
    async currency () {
      console.log('Card.currency')
      return []
    },
    async bank () {
      console.log('Card.bank')
      return []
    }
  }
}
