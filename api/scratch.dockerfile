FROM golang:1.14.4 as build

WORKDIR /go/src/app
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /go/src/app/bin/server main.go
# CMD ENV=development PORT=4500 DB_HOST=localhost DB_PORT=5432 DB_USER=admin DB_PASSWORD=1234 go run main.go

FROM scratch
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
WORKDIR /bin
COPY --from=build /go/src/app/bin/server ./server
CMD server