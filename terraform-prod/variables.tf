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
  type    = string
  default = "sfo2"
}

variable "docker_id" {
  type = string
}

variable "docker_password" {
  type = string
}

variable "admin_gmail_account" {
  type = string
}

variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type = string
}

variable "secret_jwt" {
  type = string
}

variable "db_password" {
  type = string
}

variable "s3_access_id" {
  type = string
}

variable "s3_access_secret" {
  type = string
}
