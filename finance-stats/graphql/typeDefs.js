'use strict'

module.exports = `
  scalar Date

  type Transaction {
    id: ID!
    date: Date
    description: String
    amount: Float
    type: TransactionType
    note: String
    currencyCode: String
    card: Card
    info: TransactionInfo
  }
  
  type TransactionInfo {
    id: ID!
    blockedAmount: Float
    fixedAmount: Float
    currencyExchange: Float
  }
  
  type Card {
    id: ID!
    name: String
    validFrom: Date
    validTo: Date
    currencyCode: String
    bank: Bank
    description: String
  }
  
  type Currency {
    id: ID!
    name: String
    code: String
  }
  
  type Bank {
    id: ID!
    name: String
    url: String
  }
  
  type TransactionType {
    id: ID!
    name: String
    description: String
  }
  
  type Stats {
    type: TransactionType
    amount: Int
  }

  type Filter {
    dateFrom: Date
    dateTo: Date
    limits: Int
  }

  type Query {
    transactions(dateFrom: Date, dateTo: Date, limit: Int = 20, offset: Int): [Transaction]
    transaction(id: Int): Transaction
    transactionTypes: [TransactionType]
    cards: [Card]
    banks: [Bank]
    total(dateFrom: String, dateTo: String): [Stats]
  }
  
  input TransactionCreate {
    date: Date
    description: String!
    amount: Float!
    type: ID!
    note: String
    currencyCode: String
    card: ID
    info: TransactionInfoCreate
  }
  
  input TransactionInfoCreate {
    blockedAmount: Float!
    fixedAmount: Float
  }

  type Mutation {
    addTransaction(transaction: TransactionCreate): Transaction
  }

  type Subscription {
    transactionAdded: Transaction
  }
`