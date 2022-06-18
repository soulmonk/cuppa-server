### Docker environment

- `docker network create cuppa-network`
- `docker volume create --name=cuppa-mongo-data`
- `docker volume create --name=cuppa-postgres-data`
- `docker compose -p cuppa-base -f docker-compose.yml up -d --remove-orphans`

environment:
- FASTIFY_PORT=3030 # fastify start
- PORT=3031 # node app.js

## DOCKER

### Helper
 - `export $(cat .env | xargs)`

### local
- `docker build -t cuppa-${SERVICE_NAME} .` - for local
- `docker run -d --name cuppa-${SERVICE_NAME} -p ${PORT} cuppa-${SERVICE_NAME}` - for local

### for raspberry pi

- `docker build -t cuppa/${SERVICE_NAME}:v${VERSION} --platform linux/arm64 .`
- `docker tag cuppa/${SERVICE_NAME}:v${VERSION} rpisoulv1.kube:31320/cuppa/${SERVICE_NAME}:v${VERSION}`
- `docker push rpisoulv1.kube:31320/cuppa/${SERVICE_NAME}:v${VERSION}`

