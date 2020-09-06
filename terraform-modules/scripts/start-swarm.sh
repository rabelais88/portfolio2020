#!/bin/bash

# Get Droplet's private IP
private_ip=$(hostname -I | cut -d " " -f 3)

# Start Swarm
docker swarm init \
--listen-addr $private_ip \
--advertise-addr $private_ip