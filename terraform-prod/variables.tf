variable "do_token" {
  type        = string
  description = "Your digital ocean API token"
}

variable "do_spaces_access_id" {
  type        = string
  description = "The access key ID used for Spaces API operations"
}

variable "do_region" {
  # default-sgp1
  type        = string
  description = "The digital ocean region you'd like to deploy the cluster in"
}

variable "cluster_name" {
  type        = string
  description = "The name of the Kubernetes cluster"
}

variable "cluster_version" {
  type        = string
  description = "The version of Kubernetes to install ithee cluster"
  default     = "1.18.6-do.0"
}

variable "cluster_tags" {
  type        = list(string)
  description = "A list of optional tags to add to the cluster"
  default     = []
}

variable "cluster_default_node_size" {
  # 
  type        = string
  description = "The size of the droplets in the default node pool in the cluster"
}

variable "cluster_default_node_count" {
  type        = number
  description = "The number of nodes in the default node pool in the cluster"
}

variable "cluster_default_node_tags" {
  type        = list(string)
  description = "Specific tags for the node pool in the cluster - the tags from the cluster are also applied automatically"
  default     = []
}

variable "kubeconfig_path" {
  description = "The path to save the kubeconfig to"
  default     = "~/.kube/config"
}
