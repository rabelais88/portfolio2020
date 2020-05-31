package control

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
)

type ArticleResponse struct {
	model.Article
}

type ArticlesResponse struct {
}

type ArticleQuery struct {
	ID string `query:"id" json:"id" validate:"required,alphanum"`
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
	err := cc.JSON(http.StatusOK, q)
	return err
}
