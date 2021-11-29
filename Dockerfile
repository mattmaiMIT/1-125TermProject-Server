FROM node:alpine

MAINTAINER Matt Mai <matthew6@mit.edu>

WORKDIR /app

# copy code, install npm dependencies
COPY server.js /app/server.js
COPY dbfunctions.js /app/dbfunctions.js
COPY package.json /app/package.json
COPY views/* /app/views/
COPY public/* /app/public/
RUN npm install

# expose the port of your server
EXPOSE 3001

# run app
CMD npm start 