FROM node:12.18-alpine

WORKDIR /usr/src/

COPY ["/package.json", "/package-lock.json*", "/npm-shrinkwrap.json*", "./"]

RUN npm install --silent && mv node_modules ../

COPY /. .

RUN npm i typescript -g

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
