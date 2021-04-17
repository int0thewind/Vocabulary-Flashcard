FROM node:12

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Installing dependencies
RUN yarn global add firebase-tools
RUN apt-get update && apt-get install -y openjdk-8-jre libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb openssh-client

# install packages
COPY package*.json /app/
RUN yarn install

# Copying source files
COPY . /app

# expose nextjs port
EXPOSE 3000
