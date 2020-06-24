package control

import (
	"log"
	"net/http"

	"github.com/rabelais88/portfolio2020/api/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
)

func CheckUser(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := c.(*env.CustomContext)

		user := cc.Get("user").(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)
		userId := claims["userId"].(string)
		log.Println("userId found from token", userId)

		u := model.User{}
		if cc.Db.Where(&model.User{UserID: userId}).First(&u).RecordNotFound() {
			log.Println("unable to find user from DB", u)
			c.Set("userID", "")
			return next(c)
		}
		log.Println("found user from DB", u)
		c.Set("userID", u.UserID)
		return next(c)
	}
}

func GetUserFromContext(cc *env.CustomContext) model.User {
	u := model.User{}
	cc.Db.Where(&model.User{UserID: cc.Get("userID").(string)}).First(&u)
	return u
}

func RoleAdminOnly(cc *env.CustomContext) error {
	u := GetUserFromContext(cc)
	if u.Role != `ADMIN` {
		return MakeError(http.StatusUnauthorized, `NOT_AUTHORIZED`)
	}
	return nil
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
