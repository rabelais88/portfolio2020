package control

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/novalagung/gubrak/v2"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
)

type BrowseTagsQuery struct {
	Keyword string `query:"keyword"`
}

type BrowseTagsResponseItem struct {
	Tag          string `json:"tag"`
	ArticleCount int    `json:"articleCount"`
}

type BrowseTagsResponse struct {
	Tags []BrowseTagsResponseItem `json:"tags"`
}

func BrowseTags(c echo.Context) error {
	cc := c.(*env.CustomContext)

	b := new(BrowseTagsQuery)
	if err := cc.Bind(b); err != nil {
		return MakeError(http.StatusBadRequest, "QUERY_NOT_READABLE")
	}
	// if err := cc.Validate(b); err != nil {
	// 	return err
	// }

	ts := []model.Tag{}
	if b.Keyword == "" {
		cc.Db.Preload("Articles").Limit(10).Find(&ts)
	} else {
		cc.Db.Preload("Articles").Where("value LIKE ?", b.Keyword+"%").Limit(10).Find(&ts)
	}
	rts := gubrak.From(ts).Map(func(t model.Tag) BrowseTagsResponseItem {
		return BrowseTagsResponseItem{Tag: t.Value, ArticleCount: len(t.Articles)}
	}).Result().([]BrowseTagsResponseItem)
	err := cc.JSON(http.StatusOK, BrowseTagsResponse{rts})
	if err != nil {
		return MakeError(http.StatusInternalServerError, "FAILED_MAKE_RESPONSE")
	}
	return err
}
