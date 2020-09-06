output "swarm_manager_ip" {
  value = digitalocean_droplet.swarm_manager.ipv4_address
}

output "swarm_worker_ip" {
  value = digitalocean_droplet.swarm_worker.ipv4_address
}

output "swarm_loadbalancer_ip" {
  value = digitalocean_loadbalancer.public.ip
}