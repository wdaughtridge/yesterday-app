FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY client/out /usr/src/out
COPY ["server/package.json", "server/package-lock.json*", "server/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY server .
EXPOSE 3000
RUN chown -R node /usr/src/app
RUN apk update && \
    apk add --no-cache docker
# USER node
CMD ["npm", "start"]
