package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/rabelais88/portfolio2020/api/app"
	"github.com/rabelais88/portfolio2020/api/model"
)

func TestGetTags(t *testing.T) {
	handler, db := mountTestApp()
	server := httptest.NewServer(handler)
	defer server.Close()
	defer db.Close()

	e := httpexpect.WithConfig(httpexpect.Config{
		BaseURL:  server.URL,
		Reporter: httpexpect.NewAssertReporter(t),
		Printers: []httpexpect.Printer{
			httpexpect.NewDebugPrinter(t, true),
		},
	})

	app.MakeFakeData(db)
	sampleTag := model.Tag{}
	db.First(&sampleTag)

	e.GET(`/tags`).WithQuery("keyword", sampleTag.Value[:3]).Expect().Status(http.StatusOK).JSON().Object().Value("tags").Array().Length().Ge(1)
}
