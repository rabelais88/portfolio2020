package control

import (
	"log"
	"net/http"

	"github.com/rabelais88/portfolio2020/api/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/constants"
	"github.com/rabelais88/portfolio2020/api/env"
)

func CheckUser(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := c.(*env.CustomContext)

		user := cc.Get("user").(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)
		token := claims["token"].(string)
		log.Println("token found", token)

		u := model.User{}
		if cc.Db.Where(&model.User{Token: token}).First(&u).RecordNotFound() {
			log.Println("unable to find user from DB", u)
			c.Set("userRole", constants.USER_ROLE.NO_ROLE)
			c.Set("userID", "")
			c.Set("userToken", "")
			c.Set("userEmail", "")
			return next(c)
		}
		log.Println("found user from DB", u)
		c.Set("userRole", u.Role)
		c.Set("userID", u.UserID)
		c.Set("userToken", u.Token)
		c.Set("userEmail", u.Email)

		return next(c)
	}
}

type UserTestResponse struct {
	Role   string `json:"role"`
	UserID string `json:"userId"`
}

func UserTest(c echo.Context) error {
	cc := c.(*env.CustomContext)
	res := UserTestResponse{
		Role:   cc.Get("userRole").(string),
		UserID: cc.Get("userID").(string),
	}
	err := cc.JSON(http.StatusOK, res)
	if err != nil {
		return MakeError(http.StatusInternalServerError, "UNABLE_TO_CREATE_RESPONSE")
	}
	return nil
}
