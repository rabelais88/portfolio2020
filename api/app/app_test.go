package app

import (
	"net/http"
	"os"

	"github.com/rabelais88/portfolio2020/api/env"
)

func MountTestApp() http.Handler {
	os.Setenv(`ENV`, env.TEST)
	e := Init()
	return e
}
