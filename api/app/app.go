package app

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/brianvoe/gofakeit/v5"
	"github.com/jinzhu/gorm"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
)

type CustomValidator struct {
	validator *validator.Validate
}

type ValidationErrorResponse struct {
	Detail  string `json:"detail"`
	Message string `json:"message"`
}

func (cv *CustomValidator) Validate(i interface{}) error {
	err := cv.validator.Struct(i)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, ValidationErrorResponse{err.Error(), "VALIDATION_FAILED"})
	}
	return err
}

func MakeFakeData(db *gorm.DB) {
	for i := 0; i < 100; i++ {
		rand.Seed(time.Now().UnixNano())

		var tags []model.Tag
		for t := 0; t < rand.Intn(10); t++ {
			tags = append(tags, model.Tag{Value: gofakeit.BuzzWord()})
		}

		p := &model.Post{
			Article: &model.Article{
				Type:       "POST",
				Title:      gofakeit.Sentence(2),
				Desc:       gofakeit.Sentence(3),
				CoverImage: gofakeit.ImageURL(340, 240),
				Link:       gofakeit.URL(),
				Tags:       tags,
			},
			Content: gofakeit.Paragraph(3, 2, 5, "<br />"),
		}
		db.Create(p)
	}
	var ps []model.Post
	db.Find(&ps)
	log.Println("fake db created")
}

func Init() (http.Handler, *gorm.DB) {
	config := *env.GetConfig()

	log.Println("app initialized")
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: config.AllowedOrigins,
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))
	e.Static("/assets", config.FileLocation)

	db := ConnectDB(&config)

	// extend default context
	e.Use(env.ExtendContext(config, db))
	e.Validator = &CustomValidator{validator: validator.New()}

	ConnectRouter(e, &config)
	_port := fmt.Sprintf(":%s", config.Port)

	if config.Env != env.PROD && config.FakeData {
		MakeFakeData(db)
	}

	// bails out if it's a test environment.
	if config.Env == env.TEST {
		return e, db
	}

	err := e.Start(_port)
	if err != nil {
		e.Logger.Fatal(err)
	}
	return e, db
}
