package control

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/rabelais88/portfolio2020/api/view"
)

func TestAddArticle(t *testing.T) {
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

	e.POST(`/article`).WithJSON(view.AddArticleBody{
		Content: "testing 1234",
		Type:    "POST",
		Title:   "OOOH lala",
		Image:   "https://google.com",
		Tags:    []string{"beans", "bananas", "tag1"},
		URLSlug: "test-slug",
	}).Expect().Status(http.StatusOK).JSON().Object().ValueEqual("urlSlug", "test-slug")

	e.GET(`/article/{urlslug}`).WithPath("urlslug", "test-slug").Expect().Status(http.StatusOK).JSON().Object().ValueEqual("content", "testing 1234")
	e.POST(`/article`).WithJSON(view.AddArticleBody{
		Content: "redundant",
		Type:    "POST",
		Title:   "redundant",
		Tags:    []string{"beans"},
		URLSlug: "test-slug",
	}).Expect().Status(http.StatusBadRequest)
	// e.GET(`/tags`).WithQuery("keyword", "tag1").Expect().Status(http.StatusOK).JSON().Object().Value("tags").Array().First().Object().ValueEqual("articleCount", 1)
}

// func TestGetArticle(t *testing.T) {
// 	handler, _, ms := mountTestApp()
// 	server := httptest.NewServer(handler)
// 	defer server.Close()
// 	// defer db.Close()

// 	e := httpexpect.WithConfig(httpexpect.Config{
// 		BaseURL:  server.URL,
// 		Reporter: httpexpect.NewAssertReporter(t),
// 		Printers: []httpexpect.Printer{
// 			httpexpect.NewDebugPrinter(t, true),
// 		},
// 	})

// 	p := scheme.MakeFakePost()
// 	// app.MakeFakeData(db)
// 	// db.Create(&p)
// 	// db.Save(&p)
// 	log.Printf("%v", p)

// 	e.GET(`/article/{urlslug}`).WithPath("urlslug", p.URLSlug).Expect().Status(http.StatusOK)
// 	e.GET(`/article`).Expect().Status(http.StatusMethodNotAllowed)
// 	// e.GET(`/article`).WithQuery("id", "12$$&A").Expect().Status(http.StatusBadRequest)
// }

// func TestGetArticles(t *testing.T) {
// 	handler, db := mountTestApp()
// 	server := httptest.NewServer(handler)
// 	defer server.Close()
// 	defer db.Close()

// 	e := httpexpect.WithConfig(httpexpect.Config{
// 		BaseURL:  server.URL,
// 		Reporter: httpexpect.NewAssertReporter(t),
// 		Printers: []httpexpect.Printer{
// 			httpexpect.NewDebugPrinter(t, true),
// 		},
// 	})
// 	app.MakeFakeData(db)
// 	ps := []model.Article{}
// 	db.Where(&model.Article{Type: constants.ARTICLES.POST}).Find(&ps)
// 	as := []model.Article{}
// 	db.Find(&as)

// 	e.GET(`/articles`).Expect().Status(http.StatusOK)
// 	e.GET(`/articles`).WithQuery("sort", "abce1234").Expect().Status(http.StatusOK)
// 	e.GET(`/articles`).WithQuery("order", "asc").Expect().Status(http.StatusOK)
// 	e.GET(`/articles`).WithQuery("order", "wrongorder").Expect().Status(http.StatusBadRequest)
// 	e.GET(`/articles`).Expect().Status(http.StatusOK).JSON().Object().ValueEqual("count", len(as))
// 	e.GET(`/articles`).WithQuery("type", "POST").Expect().Status(http.StatusOK).JSON().Object().ValueEqual("count", len(ps))
// 	e.GET(`/articles`).WithQuery("type", "MEDIA").Expect().Status(http.StatusOK).JSON().Object().ValueEqual("count", 0)

// 	db.Create(&model.Article{
// 		Title: "testTitle",
// 	})

// 	e.GET(`/articles`).Expect().Status(http.StatusOK).JSON().Object().Value("list").Array().First().Object().ValueEqual("title", "testTitle")

// 	tag := model.Tag{}
// 	db.Take(&tag)
// 	e.GET(`/articles`).WithQuery("tag", tag.Value).Expect().Status(http.StatusOK)
// }

// func TestDeleteArticle(t *testing.T) {
// 	handler, db := mountTestApp()
// 	server := httptest.NewServer(handler)
// 	defer server.Close()
// 	defer db.Close()

// 	e := httpexpect.WithConfig(httpexpect.Config{
// 		BaseURL:  server.URL,
// 		Reporter: httpexpect.NewAssertReporter(t),
// 		Printers: []httpexpect.Printer{
// 			httpexpect.NewDebugPrinter(t, true),
// 		},
// 	})
// 	app.MakeFakeData(db)
// 	ps := []model.Post{}
// 	var beforeCount int
// 	db.Find(&ps).Count(&beforeCount)
// 	// db.Limit(2).Find(&ps)

// 	e.DELETE(`/auth/article`).WithQuery("articleId", "totallywrongid").Expect().Status(http.StatusBadRequest)

// 	e.DELETE(`/auth/article`).WithQuery("articleId", ps[0].ArticleID).Expect().Status(http.StatusOK)
// 	var afterCount int
// 	db.Find(&ps).Count(&afterCount)
// 	if afterCount >= beforeCount {
// 		t.Errorf("count before %d count after %d - record not deleted", beforeCount, afterCount)
// 	}
// }
