variable "do_token" {
  type = string
}

variable "public_ssh_key_location" {
  type = string
}

variable "private_ssh_key_location" {
  type = string
}

variable "do_region" {
  type = string
  default = "sfo2"
}

variable "docker_id" {
  type = string
}

variable "docker_password" {
  type = string
}