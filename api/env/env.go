package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/rabelais88/portfolio2020/api/lib"
)

type Environment string

const (
	DEV   = `development`
	PROD  = `production`
	STAGE = `stage`
	TEST  = `test`
)

var fileNamesByEnv = map[string]string{
	DEV:   `dev.env`,
	PROD:  `prod.env`,
	STAGE: `stage.env`,
	TEST:  `test.env`,
}

type _environments struct {
	DEV   string
	PROD  string
	STAGE string
	TEST  string
}

var ENVIRONMENTS = &_environments{
	DEV:   DEV,
	PROD:  PROD,
	STAGE: STAGE,
	TEST:  TEST,
}

type Config struct {
	Port       string
	Env        string
	DBHost     string
	DBPort     string
	DBUser     string
	DBName     string
	DBPassword string
}

func GetConfig() *Config {
	env := os.Getenv(`ENV`)
	fileName, ok := fileNamesByEnv[env]
	if !ok {
		log.Printf(`no ENV. or undeclared ENV(%s) -> fall back to default environment(%s)`, env, ENVIRONMENTS.DEV)
		env = ENVIRONMENTS.DEV
		fileName = fileNamesByEnv[env]
	}

	log.Printf(`current environment: %s`, env)

	err := godotenv.Load(fileName)
	if err != nil {
		log.Printf("environment file missing(%s) -> the program will rely on local env", fileName)
	}

	_config := Config{
		Port:       lib.CheckString(os.Getenv(`PORT`), `4500`),
		Env:        env,
		DBHost:     lib.CheckString(os.Getenv(`DB_HOST`), `localhost`),
		DBPort:     lib.CheckString(os.Getenv(`DB_PORT`), `5432`),
		DBUser:     os.Getenv(`DB_USER`),
		DBName:     lib.CheckString(os.Getenv(`DB_NAME`), `portfolio2020`),
		DBPassword: os.Getenv(`DB_PASSWORD`),
	}
	return &_config
}
