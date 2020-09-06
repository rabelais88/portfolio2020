resource "digitalocean_ssh_key" "default" {
  name       = "swarm-ssh"
  public_key = var.public_key
}

resource "digitalocean_droplet" "swarm_manager" {
  image              = "ubuntu-20-04-x64"
  name               = "swarm-manager-1"
  region             = var.do_region
  size               = "s-1vcpu-1gb"
  private_networking = true
  ssh_keys           = [digitalocean_ssh_key.default.fingerprint]

  connection {
    user        = "root"
    type        = "ssh"
    host        = self.ipv4_address
    private_key = var.private_key
  }

  provisioner "file" {
    source      = "../docker-compose.yaml"
    destination = "/srv/docker-compose.yaml"
  }

  provisioner "file" {
    source      = "${path.module}/scripts/docker-install.sh"
    destination = "/srv/docker-install.sh"
  }

  provisioner "file" {
    source      = "${path.module}/scripts/start-swarm.sh"
    destination = "/srv/start-swarm.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "echo ${var.docker_password} | docker login -u ${var.docker_id} --password-stdin",
      "printf ${var.admin_gmail_account} | docker secret create portfolio-admin-gmail-account -",
      "printf ${var.google_client_id} | docker secret create portfolio-google-client-id",
      "printf ${var.google_client_secret} | docker secret create portfolio-google-client-secret",
      "printf ${var.secret_jwt} | docker secret create portfolio-secret-jwt",
      "printf ${var.db_password} | docker secret create portfolio-db-password",
      "sh /srv/docker-install.sh",
      "sh /srv/start-swarm.sh",
    ]
  }

  provisioner "local-exec" {
    command = "ssh -i ${var.private_ssh_key_location} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@${self.ipv4_address} 'docker swarm join-token -q worker' > ${path.cwd}/token.txt"
  }
}

resource "digitalocean_droplet" "swarm_worker" {
  image              = "ubuntu-20-04-x64"
  name               = "swarm-worker-1"
  region             = var.do_region
  size               = "s-1vcpu-1gb"
  private_networking = true
  ssh_keys           = [digitalocean_ssh_key.default.fingerprint]

  connection {
    user        = "root"
    type        = "ssh"
    host        = self.ipv4_address
    private_key = var.private_key
  }

  provisioner "file" {
    source      = "${path.module}/scripts/docker-install.sh"
    destination = "/srv/docker-install.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "sh /srv/docker-install.sh",
      "docker swarm join --token ${trimspace(file("${path.cwd}/token.txt"))} ${digitalocean_droplet.swarm_manager.ipv4_address_private}:2377"
    ]
  }

  provisioner "local-exec" {
    command = "ssh -i ${var.private_ssh_key_location} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@${digitalocean_droplet.swarm_manager.ipv4_address} 'cd /srv && docker stack deploy --compose-file docker-compose.yaml testapp'"
  }
}

# https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/loadbalancer
resource "digitalocean_loadbalancer" "public" {
  name   = "swarm-load-balancer"
  region = var.do_region

  forwarding_rule {
    entry_port     = 80 # outbound
    entry_protocol = "http"

    target_port     = 80 # inbound
    target_protocol = "http"
  }

  healthcheck {
    port     = 80 # inbound
    protocol = "tcp"
  }

  droplet_ids = [digitalocean_droplet.swarm_manager.id, digitalocean_droplet.swarm_worker.id]
}
