### Docker environment

- `docker network create cuppa-network`
- `docker volume create --name=mongo-data`
- `docker volume create --name=postgres-data`
- `docker-compose -p cuppa-base -f docker-compose.yml up --remove-orphans`
test signed
