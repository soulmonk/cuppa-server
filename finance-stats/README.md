[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## TODO

- move to koa ?
- check appolo server, what is it
- testing web sockets

- fastify log level (errors)

## Graphql questions

- how to create and use pagination
- type defs default types
    - type enum
    - optional
    - PROBLEM with parameter and type `Filter`` in `transactions(filter: Filter): [Transaction]`
    

## Definition:

- Transaction:
    - date
    - short desc
    - amount
    - currency of transaction
    - type (typeId)
    - description
    - card or cache (word cache)
        - card info
        - blocked amount
        - fixed amount
        - currency exchange at date of transaction
        
- cards
   - alias
   - valid from
   - valid to
   - currency
   - bank
   - type (mastercard / visa)

- saves
