package env

import (
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/s3worker"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type CustomContext struct {
	echo.Context
	Config      *Config
	Db          *gorm.DB
	S3W         *s3worker.S3Worker
	OAuthConfig *oauth2.Config
	UserToken   *string
}

func GetOAuthConfig(config Config) *oauth2.Config {
	return &oauth2.Config{
		ClientID:     config.GoogleID,
		ClientSecret: config.GoogleSecret,
		RedirectURL:  config.GoogleRedirectUrl,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}
}

func ExtendContext(config Config, db *gorm.DB, s3w *s3worker.S3Worker) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &CustomContext{
				c,
				&config,
				db,
				s3w,
				GetOAuthConfig(config),
				nil,
			}
			return next(cc)
		}
	}
}
