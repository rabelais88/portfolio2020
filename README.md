# portfolio renewal project 2020

- [api readme](https://github.com/rabelais88/portfolio2020/tree/master/api/README.md)
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

# deployment in production environment

```sh
cd terraform-prod
# variable file(.tfvars) and sshkey file are necessary for deployment
# make emtpy token.txt file for later use
touch token.txt
# create terraform variable file(.tfvars) with secrets
vi terraform.tfvars
# create sshkey
sshkey -f mykey

terraform init

# check if file is valid
terraform validate
terraform plan

# deploy
terraform apply

# accessing ssh
ssh -i mykey root@${SWARM_MANAGER_IP}
```

```sh
# terraform-prod/terraform.tfvars
# digital ocean secret key
do_token = "..."
public_ssh_key_location = "./mykey.pub"
private_ssh_key_location = "./mykey"
# docker id for accessing private repository
docker_id = "..."
docker_password = "..."
```

# caveat

- api frontend must be served in accordance with [vue history mode configuration](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)

# issues
 - Golang alpine build suffers from huge image size, due to gcc
 - rigorous stress test
 - cache(redis) support
 - deletions burst cause missing tables: need to check if it's in-memory db issue

# what I've learned
- don't use docker `:scratch` build unless it's necessary. If you feel tempted, don't.
- `traefik` doesn't have static file serving feature. Any files should be served via `nginx` and proxied by `traefik`; it's perfectly normal.
- `Google OAuth` redirection regex is ridiculous. It seems the regex differentiates subdomain(`xxx.abcd.efg`) and top-level(`abcd.xxx`) domain by the numbers of dots! due to this, subdomain can't be tested in local environment.
- `next.js` doesn't fully support `redux` on server side. There are tricks to make it work but it's hackish and the support seems very filmsy on that.
- [on GORM joins](https://kaviraj.me/go-gorm-using-joins/)
- traefik has some missing instructions on their documents
  - must add internal overlay network on each service
  - all the networks must be explicitly registered on traefik label: `traefik.docker.network=my_network`