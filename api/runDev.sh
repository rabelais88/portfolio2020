# run with docker-compose
JAEGER_AGENT_HOST=localhost JAEGER_AGENT_PORT=6831 JAEGER=true \
ENV=development DB_USER=admin DB_PASSWORD=1234 DB_NAME=portfolio FAKE_DATA=true DB_DEBUG=true \
go run main.go