package control

import (
	"log"
	"net/http"

	"github.com/rabelais88/portfolio2020/api/constants"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/lib"
	"github.com/rabelais88/portfolio2020/api/model"
	"github.com/vcraescu/go-paginator"
	"github.com/vcraescu/go-paginator/adapter"
	"github.com/vcraescu/go-paginator/view"
)

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

	switch a.Type {
	case constants.ARTICLES.POST:
		p := &model.Post{ArticleID: a.ID}
		cc.Db.Preload("Article").Preload("Article.Tags").Find(&p)
		return cc.JSON(http.StatusOK, p)
	default:
		return cc.JSON(http.StatusOK, a)
	}

}

type ArticlesQuery struct {
	PagingQuery
	Type string `query:"type" json:"type" validate:"omitempty,alphanum"`
	// Tags    string `query:"tags" validate:"omitempty"` // tags separated by comma(,)
	Tag     string `query:"tag" validate:"omitempty"`
	Keyword string `query:"keyword" validate:"omitempty,alphanum"`
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
	articleDb := cc.Db.Order("updated_at desc").Preload("Tags").Model(model.Article{})
	if q.Tag != "" {
		targetTag := model.Tag{Value: q.Tag}
		articleDb = cc.Db.Model(&targetTag).Related(&model.Article{}, "Articles").Preload("Tags")
	}

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
	log.Printf("page request size %d, currentPage %d", pageSize, q.Page)

	err := cc.JSON(http.StatusOK, ArticlesResponse{
		PagedResponse: PagedResponse{
			p.Nums(),
			q.Page,
			view.Next(),
			view.Prev(),
			view.Pages(),
			pageSize,
		},
		List: articles,
	})
	return err
}

type DeleteArticleQuery struct {
	ArticleID string `validate:"required" query:"articleId"`
}

type DeleteArticleResponse struct {
	Success bool `json:"success"`
}

func DeleteArticle(c echo.Context) error {
	cc := c.(*env.CustomContext)

	if err := RoleAdminOnly(cc); err != nil {
		return err
	}

	q := new(DeleteArticleQuery)
	if err := cc.Bind(q); err != nil {
		return MakeError(http.StatusBadRequest, "QUERY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(q); err != nil {
		return err
	}

	a := model.Article{}
	if blank := cc.Db.Where(&model.Article{ID: q.ArticleID}).Find(&a).RecordNotFound(); blank {
		return MakeError(http.StatusBadRequest, "ARTICLE_NOT_EXIST")
	}
	switch a.Type {
	case "POST":
		cc.Db.Where(&model.Post{ArticleID: q.ArticleID}).Delete(&model.Post{})
	default:
	}
	cc.Db.Where(&model.Article{ID: q.ArticleID}).Delete(&model.Article{})
	err := cc.JSON(http.StatusOK, DeleteArticleResponse{Success: true})
	return err
}
