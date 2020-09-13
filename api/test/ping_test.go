package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
)

func TestPing(t *testing.T) {
	handler, _, _ := mountTestApp()
	server := httptest.NewServer(handler)
	defer server.Close()
	// defer db.Close()

	e := httpexpect.WithConfig(httpexpect.Config{
		BaseURL:  server.URL,
		Reporter: httpexpect.NewAssertReporter(t),
		Printers: []httpexpect.Printer{
			httpexpect.NewDebugPrinter(t, true),
		},
	})

	e.GET(`/`).Expect().Status(http.StatusOK)
}
