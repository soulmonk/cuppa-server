FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
