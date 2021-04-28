### Docker environment

- `docker network create cuppa-network`
- `docker volume create --name=mongo-data`
- `docker volume create --name=postgres-data`
- `docker-compose -p cuppa-base -f docker-compose.yml -d up --remove-orphans`

environment:
- FASTIFY_PORT=3030 # fastify start
- PORT=3031 # node app.js
