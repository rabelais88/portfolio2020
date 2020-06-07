package app

import (
	"fmt"
	"log"
	"net/http"

	"github.com/jinzhu/gorm"

	"github.com/go-playground/validator"
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
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	db := ConnectDB(&config)

	// extend default context
	e.Use(env.ExtendContext(config, db))
	e.Validator = &CustomValidator{validator: validator.New()}

	ConnectRouter(e, &config)
	_port := fmt.Sprintf(":%s", config.Port)

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
