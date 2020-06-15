package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/brianvoe/gofakeit/v5"
	"github.com/gavv/httpexpect/v2"
	"github.com/rabelais88/portfolio2020/api/model"
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

	p := &model.Post{
		Article: &model.Article{
			Type:       "POST",
			Title:      gofakeit.Sentence(2),
			Desc:       gofakeit.Sentence(3),
			CoverImage: gofakeit.ImageURL(340, 240),
			Link:       gofakeit.URL(),
		},
		Content: gofakeit.Paragraph(3, 2, 5, "<br />"),
	}
	db.Create(p)

	e.GET(`/article`).WithQuery("id", p.ArticleID).Expect().Status(http.StatusOK)
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

	for i := 0; i < 100; i++ {
		p := &model.Post{
			Article: &model.Article{
				Type:       "POST",
				Title:      gofakeit.Sentence(2),
				Desc:       gofakeit.Sentence(3),
				CoverImage: gofakeit.ImageURL(340, 240),
				Link:       gofakeit.URL(),
			},
			Content: gofakeit.Paragraph(3, 2, 5, "<br />"),
		}
		db.Create(p)
	}
	var ps []model.Post
	db.Find(&ps)

	e.GET(`/articles`).Expect().Status(http.StatusOK)
	e.GET(`/articles`).WithQuery("sort", "abce1234").Expect().Status(http.StatusOK)
	e.GET(`/articles`).WithQuery("order", "asc").Expect().Status(http.StatusOK)
	e.GET(`/articles`).WithQuery("order", "wrongorder").Expect().Status(http.StatusBadRequest)
	e.GET(`/articles`).Expect().Status(http.StatusOK).JSON().Object().ValueEqual("count", len(ps))
	e.GET(`/articles`).WithQuery("type", "POST").Expect().Status(http.StatusOK).JSON().Object().ValueEqual("count", len(ps))
	e.GET(`/articles`).WithQuery("type", "MEDIA").Expect().Status(http.StatusOK).JSON().Object().ValueEqual("count", 0)
}
