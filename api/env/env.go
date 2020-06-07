package env

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/novalagung/gubrak/v2"
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
	Url          string
	Port         string
	Env          string
	DBHost       string
	DBPort       string
	DBUser       string
	DBName       string
	DBMemory     string // for local test
	DBPassword   string
	SecretJWT    string
	GoogleID     string
	GoogleSecret string
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

	port := lib.CheckString(os.Getenv(`PORT`), `4500`)

	_config := Config{
		Url:          lib.CheckString(os.Getenv(`URL`), fmt.Sprintf(`http://localhost:%s`, port)),
		Port:         port,
		Env:          env,
		DBHost:       lib.CheckString(os.Getenv(`DB_HOST`), `localhost`),
		DBPort:       lib.CheckString(os.Getenv(`DB_PORT`), `5432`),
		DBUser:       os.Getenv(`DB_USER`),
		DBName:       lib.CheckString(os.Getenv(`DB_NAME`), `portfolio2020`),
		DBMemory:     lib.CheckString(os.Getenv(`DB_MEMORY`), `false`),
		DBPassword:   os.Getenv(`DB_PASSWORD`),
		SecretJWT:    lib.CheckString(os.Getenv(`SECRET_JWT`), gubrak.RandomString(15)),
		GoogleID:     os.Getenv(`GOOGLE_CLIENT_ID`),
		GoogleSecret: os.Getenv(`GOOGLE_CLIENT_SECRET`),
	}
	return &_config
}
