'use strict'

module.exports = `
  scalar DateTime

  type Transaction {
    id: ID!
    date: DateTime
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
    validFrom: DateTime
    validTo: DateTime
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
  
  """ Category """
  type TransactionType {
    id: ID!
    name: String
    description: String
  }
  
  type Stats {
    type: TransactionType
    amount: Float
  }

  type Filter {
    dateFrom: DateTime
    dateTo: DateTime
    limits: Int
  }

  type Query {
    transactions(dateFrom: DateTime, dateTo: DateTime, limit: Int = 20, offset: Int): [Transaction]
    transaction(id: Int): Transaction
    transactionTypes: [TransactionType]
    cards: [Card]
    banks: [Bank]
    total(dateFrom: DateTime, dateTo: DateTime): [Stats]
  }
  
  input TransactionCreate {
    date: DateTime
    description: String!
    amount: Float!
    type: ID!
    note: String
    currencyCode: String
    card: ID
    info: TransactionInfoCreate
  }
  
  input TransactionUpdate {
    id: ID!
    date: DateTime
    description: String
    amount: Float
    type: ID
    note: String
    currencyCode: String
    card: ID
  }
  
  input TransactionInfoCreate {
    blockedAmount: Float!
    fixedAmount: Float
  }
  
  input TransactionTypeCreate {
    name: String!
    description: String
  }

  type Mutation {
    addTransaction(transaction: TransactionCreate): Transaction
    addTransactionType(type: TransactionTypeCreate): TransactionType
    updateTransaction(transaction: TransactionUpdate): Transaction
  }

  type Subscription {
    transactionAdded: Transaction
  }
`
