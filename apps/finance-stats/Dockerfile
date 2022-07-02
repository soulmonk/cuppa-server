FROM node:16-alpine AS BUILD_IMAGE

RUN apk update && apk add bash python3 g++ make

# Create app directory
WORKDIR /usr/src/app

RUN npm i -g npm

# Bundle app source
COPY . .

RUN npm install --production

FROM node:16-alpine
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/ ./

EXPOSE 3031
CMD [ "node", "app.js" ]
