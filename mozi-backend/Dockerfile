FROM mysql:8.0.33-debian
WORKDIR /app
ENV MYSQL_DATABASE=moviezonetest
ENV MYSQP_ROOT_PASSWORD=jelszo1234
EXPOSE 3306
RUN apt-get update \
&& apt-get install -y sudo \
&& apt-get install -y curl \
&& curl -fsSl https://deb.nodesource.com/setup_14.x | sudo -E bash - \
&& sudo apt-get install -y nodejs
COPY package*.json /app/
RUN npm install
COPY . .


# FROM node:14-alpine
# WORKDIR /app
# COPY package*.json /app
# RUN npm install
# COPY . .
# RUN npm test ./utils/review.test
# EXPOSE 5000
# CMD ["npm","run","devStart"]