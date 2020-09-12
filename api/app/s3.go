package app

import (
	"log"

	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/s3worker"
)

func ConnectS3Worker(config *env.Config) *s3worker.S3Worker {
	s3w, err := s3worker.New(s3worker.S3Config{
		Region:       config.S3Region,
		AccessId:     config.S3AccessID,
		AccessSecret: config.S3AccessSecret,
	})
	if err != nil {
		log.Fatal(err)
	}
	log.Print("S3 session created")
	return s3w
}
