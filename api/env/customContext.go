package env

import (
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
)

type CustomContext struct {
	echo.Context
	Config *Config
	Db     *gorm.DB
}

func ExtendContext(config Config, db *gorm.DB) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &CustomContext{
				c,
				&config,
				db,
			}
			return next(cc)
		}
	}
}
