package control

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/constants"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
)

// based on model.Article
type AddWorkBody struct {
	Title      string `json:"title" validate:"required"`
	Desc       string `json:"desc" validate:"max=100"`
	CoverImage string `json:"coverImage" validate:"omitempty,file|uri"`
	Link       string `json:"link" validate:"omitempty,file|uri"`
}

func AddWork(c echo.Context) error {
	cc := c.(*env.CustomContext)
	if cc.Get("userRole") != constants.USER_ROLE.ADMIN && cc.Config.Env != env.ENVIRONMENTS.TEST {
		return MakeError(http.StatusUnauthorized, "NOT_AUTHORIZED")
	}

	b := new(AddWorkBody)
	if err := cc.Bind(b); err != nil {
		return MakeError(http.StatusBadRequest, "BODY_NOT_UNDERSTANDABLE")
	}
	if err := cc.Validate(b); err != nil {
		return err
	}

	a := model.Article{
		Type:       constants.ARTICLES.WORK,
		Title:      b.Title,
		Desc:       b.Desc,
		CoverImage: b.CoverImage,
		Link:       b.Link,
	}

	if blank := cc.Db.NewRecord(a); !blank {
		return MakeError(http.StatusConflict, "ARTICLE_ID_CONFLICT")
	}

	cc.Db.Create(&a)
	cc.Db.Save(&a)

	_a := &model.Article{ID: a.ID}
	cc.Db.Find(&_a)

	err := cc.JSON(http.StatusOK, _a)
	return err
}
