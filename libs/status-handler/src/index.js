import S from 'fluent-json-schema'

export default function statusService (fastify) {
  fastify.route({
    method: 'GET',
    path: '/status',
    handler: onStatus,
    schema: {
      response: {
        200: S.object().prop('status', S.string())
      }
    }
  })

  async function onStatus () {
    return { status: 'ok' }
  }
}
