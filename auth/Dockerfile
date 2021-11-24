FROM node:14-alpine AS BUILD_IMAGE

RUN apk update && apk add bash python g++ make && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install --production

FROM node:14-alpine
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/ ./

EXPOSE 3030
# npm to dirrect node command
CMD [ "npm", "start" ]
