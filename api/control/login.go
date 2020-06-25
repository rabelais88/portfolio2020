package control

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
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
	Picture     string `json:"picture"`
}

type GoogleUserInfo struct {
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Picture       string `json:"picture"`
	Sub           string `json:"sub"`
}

func MakeToken(_secret []byte, userId string, email string) (string, error) {
	// https://echo.labstack.com/cookbook/jwt
	tokenJwt := jwt.New(jwt.SigningMethodHS256)

	claims := tokenJwt.Claims.(jwt.MapClaims)
	claims["userId"] = userId
	claims["email"] = email

	return tokenJwt.SignedString(_secret)
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
	var userInfo GoogleUserInfo
	if err := json.Unmarshal(userInfoResp, &userInfo); err != nil {
		return MakeError(http.StatusInternalServerError, `GOOGLE_JSON_NOT_READABLE`)
	}

	// currently, signup is open for admin only
	if userInfo.Email != cc.Config.AdminGmailAccount {
		return MakeError(http.StatusUnauthorized, `UNAUTHORIZED_ADMIN`)
	}

	u := model.User{
		Email:   userInfo.Email,
		Role:    "ADMIN",
		Picture: userInfo.Picture,
	}

	if blank := cc.Db.Where(&model.User{Token: tok.AccessToken}).First(&model.User{}).RecordNotFound(); !blank {
		// return MakeError(http.StatusConflict, "USER_ALREADY_EXIST")
		log.Println("user already exist")
	} else {
		cc.Db.Create(&u)
		log.Println("user saved", u)
	}

	jwtToken, err := MakeToken([]byte(cc.Config.SecretJWT), u.UserID, u.Email)
	if err != nil {
		return MakeError(http.StatusInternalServerError, `TOKEN_GENERATION_ERROR`)
	}
	u.Token = jwtToken
	cc.Db.Save(&u)

	errRes := cc.JSON(http.StatusOK, u)
	return errRes
}

func GetUser(c echo.Context) error {
	cc := c.(*env.CustomContext)
	u := GetUserFromContext(cc)
	err := cc.JSON(http.StatusOK, u)
	return err
}

func RefreshToken(c echo.Context) error {
	cc := c.(*env.CustomContext)
	u := GetUserFromContext(cc)
	var _u model.User
	if blank := cc.Db.Where(&model.User{Token: u.Token}).First(&_u).RecordNotFound(); !blank {
		return MakeError(http.StatusInternalServerError, `USER_DB_NOT_FOUND`)
	}
	jwtToken, errToken := MakeToken([]byte(cc.Config.SecretJWT), _u.UserID, _u.Email)
	if errToken != nil {
		return MakeError(http.StatusInternalServerError, `TOKEN_GENERATION_ERROR`)
	}
	_u.Token = jwtToken
	cc.Db.Save(&_u)
	err := cc.JSON(http.StatusOK, u)
	return err
}
