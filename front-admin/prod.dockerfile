FROM node:14.4.0-stretch as build
WORKDIR /home/node/app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
COPY . .
RUN yarn build:prod

FROM nginx:1.19.0-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /home/node/app/dist .
COPY ./nginx/default.conf /etc/nginx/templates/default.conf.template