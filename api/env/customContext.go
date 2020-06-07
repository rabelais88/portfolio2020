package env

import (
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type CustomContext struct {
	echo.Context
	Config      *Config
	Db          *gorm.DB
	OAuthConfig *oauth2.Config
	UserToken   *string
}

func GetOAuthConfig(config Config) *oauth2.Config {
	return &oauth2.Config{
		ClientID:     config.GoogleID,
		ClientSecret: config.GoogleSecret,
		RedirectURL:  fmt.Sprintf(`%s/login-cred`, config.Url),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}
}

func ExtendContext(config Config, db *gorm.DB) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &CustomContext{
				c,
				&config,
				db,
				GetOAuthConfig(config),
				nil,
			}
			return next(cc)
		}
	}
}
