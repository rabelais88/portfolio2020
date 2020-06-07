package app

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rabelais88/portfolio2020/api/control"
	"github.com/rabelais88/portfolio2020/api/env"
)

func ConnectRouter(e *echo.Echo, config *env.Config) {
	e.GET("/", GetHelloWorld)
	e.GET("/ping", control.GetPing)
	e.GET("/article", control.GetArticle)
	e.GET("/articles", control.GetArticles)
	e.GET("/login", control.GetLogin)
	e.GET("/login-cred", control.GetLoginToken)

	r := e.Group("/admin")
	if config.Env != env.ENVIRONMENTS.TEST {
		r.Use(middleware.JWT([]byte(config.SecretJWT)))
	}
	r.GET("/ping", control.GetPing)
	r.POST("/post", control.AddPost)
}
