FROM node:latest

#install server dependencies first to take advantage of docker cacheing
COPY package.json /app/package.json
WORKDIR "/app"
RUN npm install typescript@'>=2.1.0 <2.4.0'
RUN npm install
RUN npm install -g gulp

ADD . /app

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

#install client dependencies
WORKDIR "/app/client"

RUN npm install
# ensure sass recognizes the environment properly
RUN npm rebuild node-sass --force

# build project server and client
RUN gulp build

# run
CMD ["gulp", "start-docker"]
