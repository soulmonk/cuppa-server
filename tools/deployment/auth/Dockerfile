FROM node:18-alpine AS BUILD_IMAGE

RUN apk update && apk add bash python3 g++ make

# Create app directory
WORKDIR /app

# Bundle app source
COPY dist/apps/auth/package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --omit=dev

FROM node:18-alpine
USER node
WORKDIR /app

COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY dist/apps/auth .

EXPOSE 3030
# npm to dirrect node command
CMD [ "node", "main.js" ]
