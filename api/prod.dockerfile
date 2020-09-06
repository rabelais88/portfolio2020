FROM rabelais/gobuilder:1.14.4-alpine3.12

WORKDIR /go/src/app
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...
RUN go build -o /go/src/app/bin/server main.go
# CMD ENV=development PORT=4500 DB_HOST=localhost DB_PORT=5432 DB_USER=admin DB_PASSWORD=1234 go run main.go
# default values
ENV DB_HOST:=db
ENV DB_PORT:=5432
CMD ./wait-for-it.sh ${DB_HOST}:${DB_PORT} -- /go/src/app/bin/server