package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/brianvoe/gofakeit/v5"
	"github.com/gavv/httpexpect/v2"
	"github.com/rabelais88/portfolio2020/api/control"
)

func TestAddWork(t *testing.T) {
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

	title := gofakeit.Sentence(2)
	e.POST(`/auth/work`).WithJSON(control.AddWorkBody{
		Title:      title,
		Desc:       gofakeit.Sentence(3),
		CoverImage: gofakeit.ImageURL(340, 240),
		Link:       gofakeit.URL(),
	}).Expect().Status(http.StatusOK).JSON().Object().ValueEqual("title", title)
}
