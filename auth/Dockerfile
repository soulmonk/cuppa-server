FROM node:14

# Create app directory
WORKDIR /usr/src/app

# latest npm )
RUN npm i -g npm

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3030
CMD [ "npm", "start" ]
