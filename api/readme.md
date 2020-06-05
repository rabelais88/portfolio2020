# portfolio API server
# go libraries in consideration
 - https://github.com/avelino/awesome-go
 - https://github.com/novalagung/gubrak
 - https://github.com/thoas/go-funk

# usage
```sh
# installing package
go get -u

# provide dev.env/prod.env/stage.env/test.env
# or environment variables as follow
# ENV=development|production|stage|test
ENV=development PORT=4500 DB_HOST=localhost DB_PORT=5432 DB_USER=admin DB_PASSWORD=1234 go run main.go
# check .sh for more info

# build
source build.sh

# run compiled program for production
ENV=production $ARGUMENTS ./bin/server
```