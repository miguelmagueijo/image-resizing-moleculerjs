FROM node:18

WORKDIR /usr/src/api

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .

CMD ["node", "./node_modules/moleculer/bin/moleculer-runner.js --config moleculer.config.js ./services"]