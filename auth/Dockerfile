FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3030
ENV FASTIFY_PORT=3030
CMD [ "npm", "start" ]
