package control

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
)

type BrowseTagsQuery struct {
	Keyword string `query:"keyword"`
}

type BrowseTagsResponseItem struct {
	TagValue string `json:"tagValue"`
	Count    int    `json:"count"` // article count
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

	// SELECT tag_value, COUNT(article_id) FROM public.article_tags GROUP BY tag_value ORDER BY COUNT(article_id) DESC;
	// method 1 - does work, but the count becomes 0 on in-memory mode.
	ts := []BrowseTagsResponseItem{}
	db := cc.Db.Table("article_tags").Select("tag_value, COUNT(article_id)").Group("tag_value").Order("COUNT(article_id) desc").Limit(10)
	if b.Keyword != "" {
		db = db.Where("tag_value LIKE ?", b.Keyword+"%")
	}
	db.Scan(&ts)

	err := cc.JSON(http.StatusOK, BrowseTagsResponse{ts})
	if err != nil {
		return MakeError(http.StatusInternalServerError, "FAILED_MAKE_RESPONSE")
	}
	return err
}
