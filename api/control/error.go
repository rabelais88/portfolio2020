package control

import (
	"github.com/labstack/echo/v4"
)

type CustomError struct {
	Message string `json:"message"`
}

func MakeError(code int, message string) *echo.HTTPError {
	return echo.NewHTTPError(code, CustomError{message})
}
