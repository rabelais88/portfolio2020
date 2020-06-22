FROM node:14.4.0-stretch as build
WORKDIR /home/node/app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
COPY . .
RUN yarn build

FROM node:14.4.0-alpine
WORKDIR /home/node/app
COPY --from=build /home/node/app .
CMD yarn start