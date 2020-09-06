package control

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/gavv/httpexpect/v2"
)

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

func TestUploadFile(t *testing.T) {
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

	fileName := e.POST(`/auth/file`).WithMultipart().WithFile("files", "./test_image.svg").Expect().Status(http.StatusOK).JSON().Object().Value("urls").Array().First().String().Raw()
	fileLoc := filepath.Join("../files", fileName)
	if !fileExists(fileLoc) {
		t.Errorf("file doesn't exist! - %s", fileLoc)
	}

	servedFileLoc := filepath.Join("/assets", fileName)
	e.GET(servedFileLoc).Expect().Status(http.StatusOK)

	os.Remove(fileLoc)
}
