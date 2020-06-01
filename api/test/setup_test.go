package control

import (
	"net/http"
	"os"

	"github.com/jinzhu/gorm"
	"github.com/rabelais88/portfolio2020/api/app"
	"github.com/rabelais88/portfolio2020/api/env"
)

func mountTestApp() (http.Handler, *gorm.DB) {
	os.Setenv(`ENV`, env.TEST)
	e, db := app.Init()
	return e, db
}
