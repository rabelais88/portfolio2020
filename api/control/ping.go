package control

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
)

type PingResponse struct {
	Pong bool `json:"pong" xml:"pong"`
}

func GetPing(c echo.Context) error {
	cc := c.(*env.CustomContext)
	res := PingResponse{
		Pong: true,
	}
	err := cc.JSON(http.StatusOK, res)
	return err
}
