package s3worker

import (
	"log"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go/aws/credentials"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

type S3Config struct {
	Region       string
	AccessId     string
	AccessSecret string
}

type S3Worker struct {
	Session *session.Session
	Config  *S3Config
}

// func (s3w S3Worker) HandleError(msg string, args ...interface{}) {
// 	log.Fatalf(msg+"\n", args...)
// }

func (s3w S3Worker) UploadFile(bucket string, filename string) (*s3manager.UploadOutput, error) {
	_filename := filepath.Base(filename)
	file, err := os.Open(filename)
	if err != nil {
		log.Fatalf("Unable to open file %v", err)
	}

	defer file.Close()

	log.Println(file)

	uploader := s3manager.NewUploader(s3w.Session)

	return uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(_filename),
		Body:   file,
	})
}

func New(config S3Config) (*S3Worker, error) {
	session, err := session.NewSession(&aws.Config{
		Region:      aws.String(config.Region),
		Credentials: credentials.NewStaticCredentials(config.AccessId, config.AccessSecret, ""),
	})
	if err != nil {
		return nil, err
	}
	return &S3Worker{
		Session: session,
		Config:  &config,
	}, nil
}
