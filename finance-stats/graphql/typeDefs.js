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
