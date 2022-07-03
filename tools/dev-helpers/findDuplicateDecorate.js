
const originDecorateRequest = fastify.decorateRequest.bind(fastify)
fastify.decorateRequest = (...args) => {
  console.log('app.js::decorateRequest::12 >>>', args[0])
  if (args[0] === 'user') {
    console.log('app.js::decorateRequest::14 >>>', new Error().stack)
  }
  originDecorateRequest(...args)
}
