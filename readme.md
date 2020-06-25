# portfolio renewal project 2020

- [api readme](https://github.com/rabelais88/portfolio2020/tree/master/api/readme.md)
- [frontend readme](https://github.com/rabelais88/portfolio2020/tree/master/front-www/README.md)
- [frontend(api) readme](https://github.com/rabelais88/portfolio2020/tree/master/front-api/README.md)

# run in local environment

```sh
# there are 3 ways of running the clusters in local environment.

# 1. run by shell command
cd api
source runDevLocal.sh

cd front-admin
yarn dev

cd front-www
yarn dev

# 2. run by Docker-Swarm without Traefik
docker-compose -f local.noproxy.docker-compose.yaml up
docker-compose -f local.noproxy.docker-compose.yaml down

# 3. run by Docker-Swarm with Traefik(currently not working, Google API rejects localhost with subdomain)
docker-compose -f local.proxy.docker-compose.yaml up
docker-compose -f local.proxy.docker-compose.yaml down

# 4. run by Kubernetes, Docker Desktop
kubectl apply -f local.k8.yaml
```

# caveat

- api frontend must be served in accordance with [vue history mode configuration](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)

# what I've learned
- don't use docker `:scratch` build unless it's necessary. If you feel tempted, don't.
- `traefik` doesn't have static file serving feature. Any files should be served via `nginx` and proxied by `traefik`; it's perfectly normal.
- `Google OAuth` redirection regex is ridiculous. It seems the regex differentiates subdomain(`xxx.abcd.efg`) and top-level(`abcd.xxx`) domain by the numbers of dots! due to this, subdomain can't be tested in local environment.
- `next.js` doesn't fully support `redux` on server side. There are tricks to make it work but it's hackish and the support seems very filmsy on that.
