package app

import (
  "github.com/labstack/echo/v4"
)

func ConnectRouter(e *echo.Echo) {
  e.GET("/", GetHelloWorld)
}