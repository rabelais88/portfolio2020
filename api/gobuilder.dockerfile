# gcc library provider for faster rebuild. the image must be pushed to hub.docker.com/rabelais/gobuilder
FROM golang:1.14.4-alpine3.12
RUN apk --no-cache --update add build-base