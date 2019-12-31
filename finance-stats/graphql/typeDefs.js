'use strict'

module.exports = `
  scalar Date

  type Transaction {
    id: ID!
    date: Date
    amount: Float
    currency: Currency
    type: TransactionType
    title: String
    description: String
    card: Card
    info: TransactionInfo
  }
  
  type TransactionInfo {
    id: ID!
    blockedAmount: Float
    fixedAmount: Float
    currencyExchange: Int
  }
  
  type Card {
    id: ID!
    alias: String
    validFrom: Int
    validTo: Int
    currency: Currency
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
    alias: String
    name: String
    url: String
  }
  
  type TransactionType {
    id: ID!
    name: String
    description: String
    userOptions: UserOptions
  }
  
  type UserOptions {
    color: String
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
    status: String
    transactions: [Transaction]
    total(dateFrom: String, dateTo: String): [Stats]
  }

  type Mutation {
    addTransaction(title: String): Transaction
  }

  type Subscription {
    transactionAdded: Transaction
  }
`
