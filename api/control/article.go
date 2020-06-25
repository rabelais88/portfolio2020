package control

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/lib"
	"github.com/rabelais88/portfolio2020/api/model"
	"github.com/vcraescu/go-paginator"
	"github.com/vcraescu/go-paginator/adapter"
	"github.com/vcraescu/go-paginator/view"
)

type ArticleResponse struct {
	model.Article
}
type ArticleQuery struct {
	ID string `query:"id" json:"id" validate:"required,uuid"`
}

func GetArticle(c echo.Context) error {
	cc := c.(*env.CustomContext)
	q := new(ArticleQuery)
	if err := cc.Bind(q); err != nil {
		return MakeError(http.StatusBadRequest, "QUERY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(q); err != nil {
		return err
	}

	a := new(model.Article)

	if cc.Db.Where(&model.Article{
		ID: q.ID,
	}).Last(&a).RecordNotFound() {
		return MakeError(http.StatusNotFound, "ARTICLE_NOT_FOUND")
	}

	err := cc.JSON(http.StatusOK, ArticleResponse{*a})
	return err
}

type ArticlesQuery struct {
	PagingQuery
	Type string `query:"type" json:"type" validate:"omitempty,alphanum"`
}

type ArticlesResponse struct {
	PagedResponse
	List []model.Article `json:"list"`
}

// https://github.com/pilagod/gorm-cursor-paginator
func GetArticles(c echo.Context) error {
	cc := c.(*env.CustomContext)
	q := new(ArticlesQuery)
	if err := cc.Bind(q); err != nil {
		return MakeError(http.StatusBadRequest, "QUERY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(q); err != nil {
		return err
	}

	var articles []model.Article
	articleDb := cc.Db.Model(model.Article{})
	if q.Type != "" {
		articleDb = articleDb.Where(model.Article{Type: q.Type})
	}
	pageSize := lib.CheckInt(q.Size, 10)
	p := paginator.New(adapter.NewGORMAdapter(articleDb), pageSize)
	p.SetPage(q.Page)

	if err := p.Results(&articles); err != nil {
		return MakeError(http.StatusInternalServerError, "INTERNAL_ERROR")
	}

	view := view.New(&p)
	log.Printf("page request %d", pageSize)

	err := cc.JSON(http.StatusOK, ArticlesResponse{
		PagedResponse: PagedResponse{
			p.Nums(),
			q.Page,
			view.Next(),
			view.Prev(),
			view.Pages(),
		},
		List: articles,
	})
	return err
}
