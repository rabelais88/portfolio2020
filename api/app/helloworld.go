package app

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type HelloWorldResponse struct {
	Port string `json:"port" xml:"port"`
}

func GetHelloWorld(c echo.Context) error {
	cc := c.(*CustomContext)
	res := HelloWorldResponse{
		Port: cc.Config.Port,
	}
	err := cc.JSON(http.StatusOK, res)
	return err
}
