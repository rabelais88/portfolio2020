# portfolio API server

## go libraries in consideration

 - https://github.com/avelino/awesome-go
 - https://github.com/novalagung/gubrak
 - https://github.com/thoas/go-funk

# usage

make `.env` file in root directory of API server
```env
# dev.env, stage.env, prod.env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
URL=http://localhost:4500 # api server
REDIRECT_URL=http://localhost:5000/login # admin front
SECRET_JWT=...
ADMIN_GMAIL_ACCOUNT=...
```

```sh
# installing package
go get -u

# provide dev.env/prod.env/stage.env/test.env
# or environment variables as follow
# ENV=development|production|stage|test
ENV=development PORT=4500 DB_HOST=localhost DB_PORT=5432 $OTHER_ARGUMENTS go run main.go
# check .sh for more info
```

Authorization feature is disabled for `test` environment. It is enabled for `development` environment.
```sh
# testing logging-in situation
$ source runDevLocal.sh
$ curl http://localhost:4500/login
# copy the login URL on console message
# golang JSON encoder disables ampersand(&) and HTML escape characters(<,>) in JSON string. the message is preserved in console. otherwise, just carefully parse the JSON message to get proper URL.
2020/06/15 03:19:11 https://accounts.google.com/o/oauth2/auth?cli...
# log in from browser, copy query from the browser url(front-api must be served beforehand)
# http://localhost:5000/login?state=state&code=asjkdfldjfklds...
# try task with authentification
$ curl -H "Authorization: Bearer $TOKEN" http://localhost:4500/auth/...
```

## build and run in production

```sh
# build
source build.sh

# run compiled program for production
ENV=production $ARGUMENTS ./bin/server
```

## issues
 - alpine build suffers from huge image size
 - scratch build doesn't guarantee fine execution in server environment(esp. credentials)
 - choosing orchestrator best suited for the project: K8 vs docker-swarm
 - rigorous stress test
 - cache(redis) support