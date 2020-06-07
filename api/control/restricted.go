package control

// import (
// 	"net/http"

// 	"github.com/labstack/echo/v4"
// 	"github.com/rabelais88/portfolio2020/api/env"
// )

// type RestrictedHeader struct {
// 	Authorization string `header:"Authorizaton" validate:"required"`
// }

// func Restricted(c echo.Context) error {
// 	cc := c.(*env.CustomContext)
// 	h := new(RestrictedHeader)
// 	if err := cc.Bind(h); err != nil {
// 		return MakeError(http.StatusBadRequest, "WRONG_HEADER")
// 	}
// 	if err := cc.Validate(h); err != nil {
// 		return err
// 	}
// }
