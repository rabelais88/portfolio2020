package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
)

func TestGetArticle(t *testing.T) {
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

	e.GET(`/article`).WithQuery("id", "4567").Expect().Status(http.StatusOK)
	e.GET(`/article`).Expect().Status(http.StatusBadRequest)
	e.GET(`/article`).WithQuery("id", "12$$&A").Expect().Status(http.StatusBadRequest)
}

func TestGetArticles(t *testing.T) {
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

	e.GET(`/articles`).Expect().Status(http.StatusOK)
	e.GET(`/articles`).WithQuery("after", "abce1234").Expect().Status(http.StatusOK)
	e.GET(`/articles`).WithQuery("order", "asc").Expect().Status(http.StatusOK)
	e.GET(`/articles`).WithQuery("order", "wrongorder").Expect().Status(http.StatusBadRequest)
}
