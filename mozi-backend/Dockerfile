FROM node:14-alpine
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . .
RUN npm test
EXPOSE 5000
CMD ["npm","run","devStart"]