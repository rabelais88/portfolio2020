package env

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	secrets "github.com/ijustfool/docker-secrets"
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
	Url               string
	Port              string
	Env               string
	DBHost            string
	DBPort            string
	DBUser            string
	DBName            string
	DBMemory          bool // DB in-memory mode
	DBDebug           bool // GORM DB debug messages
	DBPassword        string
	SecretJWT         string
	GoogleID          string
	GoogleSecret      string
	AdminGmailAccount string
	AllowedOrigins    []string
	GoogleRedirectUrl string
	FileLocation      string
	FakeData          bool
	Jaeger            bool
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

	//
	defaultFileLoc := "../files"
	fileLoc := lib.CheckString(os.Getenv(`FILE_LOCATION`), defaultFileLoc)
	fileLoc, err = filepath.Abs(fileLoc)
	if err != nil {
		fileLoc, _ = filepath.Abs(defaultFileLoc)
	}

	_fakeData := lib.CheckString(os.Getenv(`FAKE_DATA`), `false`)
	_dbMemory := lib.CheckString(os.Getenv(`DB_MEMORY`), `false`)
	_dbDebug := lib.CheckString(os.Getenv(`DB_DEBUG`), `false`)
	_jaeger := lib.CheckString(os.Getenv(`JAEGER`), `false`)
	_config := Config{
		Url:               lib.CheckString(os.Getenv(`URL`), fmt.Sprintf(`http://localhost:%s`, port)),
		Port:              port,
		Env:               env,
		DBHost:            lib.CheckString(os.Getenv(`DB_HOST`), `localhost`),
		DBPort:            lib.CheckString(os.Getenv(`DB_PORT`), `5432`),
		DBUser:            os.Getenv(`DB_USER`),
		DBName:            lib.CheckString(os.Getenv(`DB_NAME`), `portfolio2020`),
		DBMemory:          false,
		DBDebug:           false,
		DBPassword:        os.Getenv(`DB_PASSWORD`),
		SecretJWT:         lib.CheckString(os.Getenv(`SECRET_JWT`), gubrak.RandomString(15)),
		GoogleID:          os.Getenv(`GOOGLE_CLIENT_ID`),
		GoogleSecret:      os.Getenv(`GOOGLE_CLIENT_SECRET`),
		AdminGmailAccount: os.Getenv(`ADMIN_GMAIL_ACCOUNT`),
		AllowedOrigins:    strings.Split(os.Getenv(`ALLOWED_ORIGINS`), ","),
		GoogleRedirectUrl: lib.CheckString(os.Getenv(`REDIRECT_URL`), fmt.Sprintf(`http://localhost:%s`, port)),
		FileLocation:      fileLoc,
		FakeData:          false,
		Jaeger:            false,
	}

	if _fakeData == `true` {
		_config.FakeData = true
	}
	if _dbMemory == `true` {
		_config.DBMemory = true
	}
	if _dbDebug == `true` {
		_config.DBDebug = true
	}
	if _jaeger == `true` {
		_config.Jaeger = true
	}

	dockerSecrets, err := secrets.NewDockerSecrets(os.Getenv("SECRET_PATH"))
	if err == nil {
		log.Println("docker secrets OK")
		secrets := dockerSecrets.GetAll()
		dbPassword := secrets[os.Getenv("DB_PASSWORD_FILE")]
		if dbPassword != "" {
			log.Println("docker secret has overwritten DB_PASSWORD")
			_config.DBPassword = dbPassword
		}
		secretJWT := secrets[os.Getenv("SECRET_JWT_FILE")]
		if secretJWT != "" {
			log.Println("docker secret has overwritten SECRET_JWT")
			_config.SecretJWT = secretJWT
		}
		googleId := secrets[os.Getenv("GOOGLE_ID_FILE")]
		if googleId != "" {
			log.Println("docker secret has overwritten GOOGLE_ID")
			_config.GoogleID = googleId
		}
		googleSecret := secrets[os.Getenv("GOOGLE_SECRET_FILE")]
		if googleSecret != "" {
			log.Println("docker secret has overwritten GOOGLE_SECRET")
			_config.GoogleSecret = googleSecret
		}
		adminGmailAccount := secrets[os.Getenv("ADMIN_GMAIL_ACCOUNT_FILE")]
		if adminGmailAccount != "" {
			log.Println("docker secret has overwritten ADMIN_GMAIL_ACCOUNT")
			_config.AdminGmailAccount = adminGmailAccount
		}
	}

	return &_config
}
