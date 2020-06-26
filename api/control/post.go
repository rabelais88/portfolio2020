package control

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/constants"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
)

// based on model.Article
type AddPostBody struct {
	Content    string `json:"content"`
	Title      string `json:"title" validate:"required"`
	Desc       string `json:"desc" validate:"max=100"`
	CoverImage string `json:"coverImage"`
	Link       string `json:"link" validate:"omitempty,file|uri"`
}

func AddPost(c echo.Context) error {
	cc := c.(*env.CustomContext)
	if err := RoleAdminOnly(cc); err != nil {
		return err
	}

	b := new(AddPostBody)
	if err := cc.Bind(b); err != nil {
		return MakeError(http.StatusBadRequest, "BODY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(b); err != nil {
		return err
	}

	a := model.Article{
		Type:       constants.ARTICLES.POST,
		Title:      b.Title,
		Desc:       b.Desc,
		CoverImage: b.CoverImage,
		Link:       b.Link,
	}

	if blank := cc.Db.NewRecord(a); !blank {
		return MakeError(http.StatusConflict, "ARTICLE_ID_CONFLICT")
	}

	p := model.Post{
		Article: &a,
		Content: b.Content,
	}

	if blank := cc.Db.NewRecord(p); !blank {
		return MakeError(http.StatusConflict, "POST_ID_CONFLICT")
	}
	cc.Db.Create(&p)
	cc.Db.Save(&p)

	_p := &model.Post{ArticleID: p.ArticleID}
	cc.Db.Preload("Article").Find(&_p)

	err := cc.JSON(http.StatusOK, _p)
	return err
}

type ModifyPostBody struct {
	ID         string `json:"id" validate:"required,uuid"`
	Content    string `json:"content"`
	Title      string `json:"title" validate:"required"`
	Desc       string `json:"desc" validate:"max=100"`
	CoverImage string `json:"coverImage"`
	Link       string `json:"link" validate:"omitempty,file|uri"`
}

func ModifyPost(c echo.Context) error {
	cc := c.(*env.CustomContext)
	if err := RoleAdminOnly(cc); err != nil {
		return err
	}

	b := new(ModifyPostBody)
	if err := cc.Bind(b); err != nil {
		return MakeError(http.StatusBadRequest, "BODY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(b); err != nil {
		return err
	}

	p := &model.Post{ArticleID: b.ID}
	cc.Db.Preload("Article").Find(&p)

	p.Article.Title = b.Title
	p.Article.Link = b.Link
	p.Article.Desc = b.Desc
	p.Article.CoverImage = b.CoverImage
	p.Content = b.Content

	cc.Db.Save(&p)

	err := cc.JSON(http.StatusOK, p)
	return err
}
