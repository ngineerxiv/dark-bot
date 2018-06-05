variable "access_key" {
    description = "AWS access key"
}

variable "secret_key" {
    description = "AWS secret access key"
}

variable "region" {
    description = "AWS region to host your network"
    default     = "ap-northeast-1"
}

provider "aws" {
    access_key = "${var.access_key}"
    secret_key = "${var.secret_key}"
    region = "${var.region}"
}

