package control

import (
	"encoding/json"
	"io/ioutil"
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
	Email       string `json:"email"`
}

type UserInfo struct {
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Picture       string `json:"picture"`
	Sub           string `json:"sub"`
}

func GetLoginToken(c echo.Context) error {
	cc := c.(*env.CustomContext)
	q := new(LoginTokenQuery)
	if err := cc.Bind(q); err != nil {
		return MakeError(http.StatusBadRequest, "QUERY_NOT_READABLE")
	}
	if err := cc.Validate(q); err != nil {
		return err
	}
	tok, errTok := cc.OAuthConfig.Exchange(oauth2.NoContext, q.Code)
	if errTok != nil || !tok.Valid() {
		return MakeError(http.StatusUnauthorized, `GOOGLE_UNAUTHORIZED`)
	}

	// https://echo.labstack.com/cookbook/jwt
	tokenJwt := jwt.New(jwt.SigningMethodHS256)

	claims := tokenJwt.Claims.(jwt.MapClaims)
	claims["token"] = tok.AccessToken

	token, err := tokenJwt.SignedString([]byte(cc.Config.SecretJWT))
	if err != nil {
		return MakeError(http.StatusInternalServerError, `FAILED_TOKEN_GENERATION`)
	}

	// fetch user info with token
	googleClient := cc.OAuthConfig.Client(oauth2.NoContext, tok)
	googleResp, err := googleClient.Get(`https://www.googleapis.com/oauth2/v3/userinfo`)
	if err != nil {
		return MakeError(http.StatusInternalServerError, `GOOGLE_DATA_NOT_ACCESSIBLE`)
	}
	defer googleResp.Body.Close()
	userInfoResp, err := ioutil.ReadAll(googleResp.Body)
	if err != nil {
		return MakeError(http.StatusInternalServerError, `GOOGLE_DATA_WRONG_BODY`)
	}
	var userInfo UserInfo
	if err := json.Unmarshal(userInfoResp, &userInfo); err != nil {
		return MakeError(http.StatusInternalServerError, `GOOGLE_JSON_NOT_READABLE`)
	}

	claims["email"] = userInfo.Email

	// if user is not registered and no other users are detected, add user as master

	res := LoginTokenResponse{token, userInfo.Email}
	errRes := cc.JSON(http.StatusOK, res)
	return errRes
}
