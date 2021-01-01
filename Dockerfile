FROM node:current-alpine
WORKDIR /app
COPY package.json /app
COPY server.js /app
COPY config.json.example /app

# RUN npm install

RUN npm install express http-auth
RUN npm install bluelinky --force
# RUN npm install body-parser

# COPY config_eu.json /app/node_modules/bluelinky
# COPY config.json /app/node_modules/bluelinky

EXPOSE 8080
CMD [ "node", "server.js" ]
