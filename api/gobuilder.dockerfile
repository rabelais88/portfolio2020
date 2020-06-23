# gcc library provider for faster rebuild. the image must be pushed to hub.docker.com/rabelais/gobuilder
FROM golang:1.14.4-alpine3.12
RUN apk --no-cache --update add build-base
RUN apk --no-cache add bash
WORKDIR /go/src/app
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x wait-for-it.sh