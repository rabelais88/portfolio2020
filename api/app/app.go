package app

import (
	"fmt"
	"log"
	"net/http"

	"github.com/jinzhu/gorm"

	"github.com/go-playground/validator"
	"github.com/labstack/echo-contrib/jaegertracing"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/rabelais88/portfolio2020/api/env"
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

func Init() (http.Handler, *gorm.DB) {
	config := *env.GetConfig()

	log.Println("app initialized")
	log.Printf("allowed origins: %v", config.AllowedOrigins)
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Static("/assets", config.FileLocation)

	db := ConnectDB(&config)
	s3w := ConnectS3Worker(&config)

	// extend default context
	e.Use(env.ExtendContext(config, db, s3w))
	e.Validator = &CustomValidator{validator: validator.New()}

	ConnectRouter(e, &config)

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     append(config.AllowedOrigins, "*"),
		AllowMethods:     []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
	}))
	_port := fmt.Sprintf(":%s", config.Port)

	if config.Env != env.PROD && config.FakeData {
		MakeFakeData(db)
	}

	// bails out if it's a test environment.
	if config.Env == env.TEST {
		return e, db
	}

	if config.Jaeger {
		log.Println("jaeger tracing enabled")
		c := jaegertracing.New(e, nil)
		defer c.Close()
	}

	err := e.Start(_port)
	if err != nil {
		e.Logger.Fatal(err)
	}
	return e, db
}
