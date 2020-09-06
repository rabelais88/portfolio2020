module "main" {
  source = "../terraform-modules"

  # ENV = "prod"
  do_token                 = var.do_token
  do_region                = var.do_region
  public_key               = file(var.public_ssh_key_location)
  private_key              = file(var.private_ssh_key_location)
  private_ssh_key_location = var.private_ssh_key_location
  docker_id                = var.docker_id
  docker_password          = var.docker_password
  admin_gmail_account      = var.admin_gmail_account
  google_client_id         = var.google_client_id
  google_client_secret     = var.google_client_secret
  secret_jwt               = var.secret_jwt
  db_password              = var.db_password
}

# module outputs are connected to root file output
output "swarm_manager_ip" {
  value = module.main.swarm_manager_ip
}

output "swarm_worker_ip" {
  value = module.main.swarm_worker_ip
}

output "swarm_loadbalancer_ip" {
  value = module.main.swarm_loadbalancer_ip
}
