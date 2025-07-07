FROM node:24-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

RUN mkdir -p uploads && npm i -g wait-port

EXPOSE 3001
CMD ["sh", "-c", "wait-port mysql:3306 && node index.js"]
