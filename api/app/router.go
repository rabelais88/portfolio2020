package app

import (
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/control"
)

func ConnectRouter(e *echo.Echo) {
	e.GET("/", GetHelloWorld)
	e.GET("/ping", control.GetPing)
	e.GET("/article", control.GetArticle)
	e.GET("/articles", control.GetArticles)
	e.GET("/login", control.GetLogin)
	e.GET("/login-cred", control.GetLoginToken)

	e.POST("/post", control.AddPost)
}
