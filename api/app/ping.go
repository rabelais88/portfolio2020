package app

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type PingResponse struct {
	Pong bool `json:"pong" xml:"pong"`
}

func GetPing(c echo.Context) error {
	cc := c.(*CustomContext)
	res := PingResponse{
		Pong: true,
	}
	err := cc.JSON(http.StatusOK, res)
	return err
}
