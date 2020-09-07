FROM node:14.4.0-stretch as build
WORKDIR /home/node/app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
COPY . .
ENV NEXT_PUBLIC_API_URL=http://api.sungryeol.com
ENV NEXT_PUBLIC_SERVER_API_URL=http://apiserver:4500
ENV NEXT_PUBLIC_IMAGE_URL=http://api.sungryeol.com/assets
RUN yarn build

FROM node:14.4.0-alpine
WORKDIR /home/node/app
# RUN apk add --no-cache bash
# RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
# RUN chmod +x wait-for-it.sh
COPY --from=build /home/node/app .
# CMD ./wait-for-it.sh ${API_URL}/ping -- yarn start
CMD yarn start