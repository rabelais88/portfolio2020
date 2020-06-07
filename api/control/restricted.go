package control

import (
	"errors"
	"net/http"
	"regexp"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
)

type RestrictedHeader struct {
	Authorization string `header:"Authorizaton" validate:"required"`
}

func RestrictedMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := c.(*env.CustomContext)
		cc.UserToken = nil
		h := new(RestrictedHeader)
		if err := cc.Bind(h); err != nil {
			return MakeError(http.StatusBadRequest, "WRONG_HEADER")
		}
		if err := cc.Validate(h); err != nil {
			return err
		}
		re := regexp.MustCompile(`Bearer (.+)`)
		tokenString := re.Find([]byte(h.Authorization))
		token, err := jwt.Parse(string(tokenString), func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("token error")
			}
			return cc.Config.SecretJWT, nil
		})
		if err != nil {
			return MakeError(http.StatusBadRequest, "WRONG_TOKEN")
		}
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			tk := claims["token"].(string)
			cc.UserToken = &tk
		}
		return next(cc)
	}
}
