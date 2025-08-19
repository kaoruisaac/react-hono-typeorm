FROM --platform=linux/amd64 node:22.17

WORKDIR /app/

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build
EXPOSE 3000

CMD npm start 