#!/bin/bash

# set -euo pipefail

# openssl req -new -text -passout pass:abcd -subj /CN=localhost -out server.req -keyout privkey.pem
# openssl rsa -in privkey.pem -passin pass:abcd -out server.key
# openssl req -x509 -in server.req -text -key server.key -out server.crt
# chmod 600 server.key
# test $(uname -s) == Linux && chown 70 server.key

# https://www.postgresql.org/docs/9.5/ssl-tcp.html
openssl req -new -x509 -days 365 -nodes -text -out server.crt \
  -keyout server.key -subj "/CN=dbhost.yourdomain.com"