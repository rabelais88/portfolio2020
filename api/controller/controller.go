package controller

import (
	"bytes"
	"log"
	"text/template"

	"github.com/meilisearch/meilisearch-go"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Controller struct {
	DB            *gorm.DB
	Meili         *meilisearch.Client
	MeiliDisabled bool
}

func NewController(config *env.Config, e *echo.Echo) (*Controller, error) {
	if config.Env == env.ENVIRONMENTS.TEST || config.MeiliHost == "" {
		db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
		log.Println("SQLite in-memory DB for local test")
		if err != nil {
			return nil, err
		}
		log.Println("Meilisearch disabled")
		_controller := &Controller{db, nil, true}
		_controller.InitDatabase()
		return _controller, nil
	}
	log.Println("Meilisearch enabled")
	meiliClient := meilisearch.NewClient(meilisearch.Config{
		Host:   config.MeiliHost,
		APIKey: config.MeiliSecret,
	})
	log.Printf("meilisearch host %s", config.MeiliHost)

	t := "user={{.DBUser}} password={{.DBPassword}} host={{.DBHost}} port={{.DBPort}} sslmode=disable Timezone=Asia/Seoul"
	tmpl, err := template.New("postgresDSN").Parse(t)
	if err != nil {
		e.Logger.Fatal(err)
	}
	var buff bytes.Buffer
	err = tmpl.Execute(&buff, *config)
	if err != nil {
		e.Logger.Fatal(err)
	}
	dsn := buff.String()
	pConfig := postgres.Config{
		DSN: dsn,
		// PreferSimpleProtocol: true,
	}
	db, err := gorm.Open(postgres.New(pConfig), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	_controller := &Controller{db, meiliClient, false}
	_controller.InitDatabase()
	_controller.InitMeili()
	return _controller, nil
}
