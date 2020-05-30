package app

import (
	"fmt"
	"log"
	"net/http"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/rabelais88/portfolio2020/api/env"
)

type CustomContext struct {
	echo.Context
	Config *env.Config
	Db     *gorm.DB
}

func extendContext(config env.Config, db *gorm.DB) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &CustomContext{
				c,
				&config,
				db,
			}
			return next(cc)
		}
	}
}

func Init() http.Handler {
	config := *env.GetConfig()

	log.Println("app initialized")
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	db := ConnectDB(&config)
	// extend default context
	e.Use(extendContext(config, db))

	ConnectRouter(e)
	_port := fmt.Sprintf(":%s", config.Port)

	// bails out if it's a test environment.
	if config.Env == env.TEST {
		return e
	}

	err := e.Start(_port)
	if err != nil {
		e.Logger.Fatal(err)
	}
	return e
}
