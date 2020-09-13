package view

import (
	"log"
	"net/http"

	"github.com/mitchellh/mapstructure"

	"github.com/rabelais88/portfolio2020/api/lib"

	"github.com/labstack/echo/v4"
	"github.com/novalagung/gubrak/v2"
	"github.com/rabelais88/portfolio2020/api/controller"
	"github.com/rabelais88/portfolio2020/api/scheme"
)

func GetArticle(c echo.Context) error {
	cc := c.(*controller.CustomContext)
	urlslug := cc.Param("urlslug")

	if cc.Controller.MeiliDisabled {
		res, err := cc.Controller.GetArticleFromDB(urlslug)
		if err != nil {
			return err
		}
		return cc.JSON(http.StatusOK, res)
	}

	res, err := cc.Controller.GetArticleFromMeili(urlslug)
	if err != nil {
		return err
	}
	decoded := scheme.ArticleView{}
	err = mapstructure.Decode(*res, &decoded)
	if err != nil {
		return controller.MakeError(http.StatusInternalServerError, "DECODING_ERROR")
	}
	return cc.JSON(http.StatusOK, decoded)
}

type GetArticlesQuery struct {
	Query string `query:"q"`
	Page  string `query:"page" validate:"omitempty,numeric"`
	Size  string `query:"size" validate:"omitempty,numeric"`
}

func GetArticles(c echo.Context) error {
	cc := c.(*controller.CustomContext)

	q := new(GetArticlesQuery)
	if err := cc.Bind(q); err != nil {
		return controller.MakeError(http.StatusBadRequest, "WRONG_QUERY")
	}

	if err := cc.Validate(q); err != nil {
		return err
	}

	page := lib.StringToInt64(q.Page, 0)
	size := lib.StringToInt64(q.Page, 10)
	searchOpt := controller.GetArticlesArg{Page: page, Size: size}
	if q.Query != "" {
		searchOpt.Query = q.Query
	}
	res, err := cc.Controller.GetArticles(searchOpt)
	if err != nil {
		return err
	}

	log.Printf("%v", res)

	return nil
}

type AddArticleBody struct {
	Type    string   `json:"type"`
	Title   string   `json:"title" validate:"required"`
	Content string   `json:"content"`
	Image   string   `json:"image"`
	Link    string   `json:"link" valdiate:"omitempty,file|uri"`
	Tags    []string `json:"tags" validate:"required"`
	URLSlug string   `json:"urlSlug" valdiate:"required"`
}

func AddArticle(c echo.Context) error {
	cc := c.(*controller.CustomContext)

	// if err := RoleAdminOnly(cc); err != nil {
	// 	return err
	// }

	b := new(AddArticleBody)
	if err := cc.Bind(b); err != nil {
		return controller.MakeError(http.StatusBadRequest, "BODY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(b); err != nil {
		return err
	}

	log.Printf("body data - %v", b)

	tags := gubrak.From(b.Tags).Map(func(t string) scheme.Tag {
		return scheme.Tag{
			Value: t,
		}
	}).Result().([]scheme.Tag)

	articleView, err := cc.Controller.WriteArticle(&scheme.Article{
		Title:   b.Title,
		Type:    b.Type,
		Content: b.Content,
		Image:   b.Image,
		Link:    b.Link,
		Tags:    tags,
		URLSlug: b.URLSlug,
	})
	if err != nil {
		return err
	}

	return cc.JSON(http.StatusOK, articleView)
}
