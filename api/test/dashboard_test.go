package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
)

func TestDashboard(t *testing.T) {
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

	e.GET(`/dashboard`).Expect().Status(http.StatusOK).JSON().Object().Keys().Contains("articleCount", "postCount", "workCount")
}
