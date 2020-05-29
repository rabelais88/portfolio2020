package app

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/rabelais88/portfolio2020/api/env"
)

type CustomContext struct {
	echo.Context
	Config *env.Config
}

func extendContext(config env.Config) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &CustomContext{
				c,
				&config,
			}
			return next(cc)
		}
	}
}

func Init() {
	config := *env.GetConfig()

	fmt.Println("app initialized")
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// extend default context
	e.Use(extendContext(config))

	ConnectRouter(e)
	_port := fmt.Sprintf(":%s", config.Port)
	err := e.Start(_port)
	if err != nil {
		e.Logger.Fatal(err)
	}
}
