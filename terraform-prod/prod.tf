module "main" {
  source = "../terraform-modules"

  # ENV = "prod"
  do_region = "default-sgp1"
  cluster_name = "cluter_prod"
  cluster_version = "1.18.6-do.0"
  cluster_tags = ["prod"]
  cluster_default_node_size = "s-1vcpu-1gb"
  cluster_default_node_count = 2
  cluster_default_node_tags = ["prod"]
  kubeconfig_path = var.kubeconfig_path
}