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
	ID string `query:"id" json:"id" validate:"required"`
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
		return MakeError(http.StatusBadRequest, "ARTICLE_NOT_FOUND")
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
	Tag     string `query:"tag"`
	Keyword string `query:"keyword"`
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
		// proper sql statement for fetching articles with specific tag value
		// SELECT * FROM articles INNER JOIN article_tags ON article_id = articles.id AND tag_value = 'firmware' LIMIT 1000;
		articleDb = cc.Db.Joins("INNER JOIN article_tags ON article_id = articles.id AND tag_value = ?", q.Tag).Model(model.Article{}).Preload("Tags").Order("updated_at desc")
	}

	if q.Type != "" {
		articleDb = articleDb.Where(model.Article{Type: q.Type})
	}

	if q.Keyword != "" {
		articleDb = articleDb.Where("title LIKE ?", q.Keyword+"%")
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
		p := model.Post{}
		cc.Db.Where(&model.Post{ArticleID: q.ArticleID}).Last(&p)
		cc.Db.Delete(&model.Post{})
	default:
		// blank
	}
	// cc.Db.Where(&model.Article{ID: q.ArticleID}).Delete(&model.Article{})
	cc.Db.Delete(&a)
	err := cc.JSON(http.StatusOK, DeleteArticleResponse{Success: true})
	return err
}
