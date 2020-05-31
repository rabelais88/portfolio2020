package app

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
)

type HelloWorldResponse struct {
	Port string `json:"port" xml:"port"`
}

func GetHelloWorld(c echo.Context) error {
	cc := c.(*env.CustomContext)
	res := HelloWorldResponse{
		Port: cc.Config.Port,
	}
	err := cc.JSON(http.StatusOK, res)
	return err
}
