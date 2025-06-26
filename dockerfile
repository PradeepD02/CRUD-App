FROM node:lts-alpine3.21
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apk add --no-cache sqlite-libs sqlite-dev
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]