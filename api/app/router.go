package app

import (
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/view"
)

func ConnectRouter(e *echo.Echo, config *env.Config) {
	e.GET("/", view.GetPing)
	// e.GET("/article", control.GetArticle)
	e.GET("/articles", view.GetArticles)
	e.GET("/article/:urlslug", view.GetArticle)
	e.POST("/article", view.AddArticle)
	// e.GET("/login", control.GetLogin)
	// provides $JWT_TOKEN
	// e.GET("/login-cred", control.GetLoginToken)
	// e.GET("/tags", control.BrowseTags)
	// e.GET("/tags-freq", control.BrowseTagsByFrequency)
	// e.GET("/dashboard", control.GetDashboard)

	// r == restricted to admin
	// https://echo.labstack.com/cookbook/jwt for accessing middleware JWT data in controller
	// r := e.Group("/auth")
	// if config.Env != env.ENVIRONMENTS.TEST {
	// 	// Header: Authorization Bearer $JWT_TOKEN
	// 	r.Use(middleware.JWT([]byte(config.SecretJWT)))
	// 	r.Use(control.CheckUser)
	// }
	// r.GET("/ping", control.GetPing)

	// r.DELETE("/article", control.DeleteArticle)
	// r.POST("/post", control.AddPost)
	// r.PUT("/post", control.ModifyPost)

	// r.GET("/test", control.UserTest)
	// r.POST("/work", control.AddWork)
	// r.GET("/user", control.GetUser)
	// r.GET("/token", control.RefreshToken)
	// r.POST("/file", control.UploadFile)
}
