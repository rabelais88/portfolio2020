package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/rabelais88/portfolio2020/api/control"
)

func TestAddPost(t *testing.T) {
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

	id := e.POST(`/auth/post`).WithJSON(control.AddPostBody{
		Content:    "testing 1234",
		Title:      "OOOH lala",
		Desc:       "this is a sample post",
		CoverImage: "https://google.com",
		Link:       "https://google.com",
	}).Expect().Status(http.StatusOK).JSON().Object().Value("articleId").String().Raw()

	e.GET(`/article`).WithQuery("id", id).Expect().Status(http.StatusOK).JSON().Object().ValueEqual("content", "testing 1234")
}
