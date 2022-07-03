FROM node:18-alpine AS BUILD_IMAGE

RUN apk update && apk add bash python3 g++ make

# Create app directory
WORKDIR /app

# Bundle app source
COPY dist/apps/finance-stats/package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --omit=dev

FROM node:18-alpine
WORKDIR /app

COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY dist/apps/finance-stats .

EXPOSE 3031
CMD [ "node", "main.js" ]
