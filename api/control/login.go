package control

import (
	"log"
	"net/http"

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
	res := LoginTokenResponse{tok.AccessToken}

	// TODO: return processed jwt instead of raw token
	err := cc.JSON(http.StatusOK, res)
	return err
}
