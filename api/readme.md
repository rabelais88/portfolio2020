# portfolio API server

## go libraries in consideration

 - https://github.com/avelino/awesome-go
 - https://github.com/novalagung/gubrak
 - https://github.com/thoas/go-funk

# usage

```env
# dev.env, stage.env, prod.env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
URL=http://localhost:4500
ADMIN_GMAIL_ACCOUNT=...
```

```sh
# installing package
go get -u

# provide dev.env/prod.env/stage.env/test.env
# or environment variables as follow
# ENV=development|production|stage|test
ENV=development PORT=4500 DB_HOST=localhost DB_PORT=5432 DB_USER=admin DB_PASSWORD=1234 DB_NAME=portfolio go run main.go
# check .sh for more info
```

## build and run in production

```sh
# build
source build.sh

# run compiled program for production
ENV=production $ARGUMENTS ./bin/server
```