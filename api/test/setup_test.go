package control

import (
	"net/http"
	"os"

	"github.com/meilisearch/meilisearch-go"

	"github.com/rabelais88/portfolio2020/api/app"
	"github.com/rabelais88/portfolio2020/api/env"
	"gorm.io/gorm"
)

func mountTestApp() (http.Handler, *gorm.DB, *meilisearch.Client) {
	os.Setenv(`ENV`, env.TEST)
	e, db, ms := app.Init()
	return e, db, ms
}
