package control

import (
	"net/http"
	"os"

	"github.com/rabelais88/portfolio2020/api/app"
	"github.com/rabelais88/portfolio2020/api/env"
)

func mountTestApp() http.Handler {
	os.Setenv(`ENV`, env.TEST)
	e := app.Init()
	return e
}
