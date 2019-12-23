FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json .
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3031
ENV FASTIFY_PORT=3031
CMD [ "npm", "run", "dev" ]
