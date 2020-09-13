package view

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/controller"
)

type PingResponse struct {
	Pong    bool   `json:"pong" xml:"pong"`
	Message string `json:"message" xml:"message"`
}

func GetPing(c echo.Context) error {
	cc := c.(*controller.CustomContext)
	res := PingResponse{
		Pong:    true,
		Message: "Portfolio API listening...",
	}
	err := cc.JSON(http.StatusOK, res)
	return err
}
