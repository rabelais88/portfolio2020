package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Environment string

const (
	DEV   = `development`
	PROD  = `production`
	STAGE = `stage`
)

var fileNamesByEnv = map[string]string{
	DEV:   `dev.env`,
	PROD:  `prod.env`,
	STAGE: `stage.env`,
}

type _environments struct {
	DEV   string
	PROD  string
	STAGE string
}

var ENVIRONMENTS = &_environments{
	DEV:   DEV,
	PROD:  PROD,
	STAGE: STAGE,
}

type Config struct {
	Port string
}

func GetConfig() *Config {
	env := os.Getenv(`ENV`)
	fileName, ok := fileNamesByEnv[env]
	if !ok {
		log.Printf(`no ENV. or undeclared ENV(%s) -> fall back to default environment(%s)`, env, ENVIRONMENTS.DEV)
		env = ENVIRONMENTS.DEV
		fileName = fileNamesByEnv[env]
	}
	err := godotenv.Load(fileName)
	if err != nil {
		log.Printf("environment file missing(%s) -> the program will rely on local env", fileName)
	}
	_config := Config{
		Port: os.Getenv(`PORT`),
	}
	return &_config
}
