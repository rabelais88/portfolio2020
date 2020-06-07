package control

import (
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
	"golang.org/x/oauth2"
)

func GetLogin(c echo.Context) error {
	cc := c.(*env.CustomContext)

	url := cc.OAuthConfig.AuthCodeURL("state")
	res := struct {
		oauth2.Config
		Url string
	}{
		*cc.OAuthConfig,
		url,
	}
	log.Println(url)
	err := cc.JSON(http.StatusOK, res)
	return err
}

type LoginTokenQuery struct {
	Code string `query:"code" validate:"required"`
}

type LoginTokenResponse struct {
	AccessToken string `json:"accessToken"`
}

func GetLoginToken(c echo.Context) error {
	cc := c.(*env.CustomContext)
	q := new(LoginTokenQuery)
	if err := cc.Bind(q); err != nil {
		return MakeError(http.StatusBadRequest, "QUERY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(q); err != nil {
		return err
	}
	tok, errTok := cc.OAuthConfig.Exchange(oauth2.NoContext, q.Code)
	if errTok != nil || !tok.Valid() {
		return MakeError(http.StatusUnauthorized, `GOOGLE_UNAUTHORIZED`)
	}

	// TODO: return processed jwt instead of raw token
	// https://echo.labstack.com/cookbook/jwt
	tokenJwt := jwt.New(jwt.SigningMethodHS256)

	claims := tokenJwt.Claims.(jwt.MapClaims)
	claims["token"] = tok.AccessToken

	token, err := tokenJwt.SignedString([]byte(cc.Config.SecretJWT))
	if err != nil {
		return MakeError(http.StatusInternalServerError, `FAILED_TOKEN_GENERATION`)
	}

	res := LoginTokenResponse{token}
	errRes := cc.JSON(http.StatusOK, res)
	return errRes
}
