FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . .
RUN npm test -- --watchAll=false
RUN npm run build

FROM node:14-alpine AS frontend
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json .
EXPOSE 3000
CMD ["npm","run","deploy"]
