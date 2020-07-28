package control

import (
	"net/http"

	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/env"
)

type BrowseTagsQuery struct {
	Keyword string `query:"keyword"`
	Limit   string `query:"limit" validate:"omitempty,numeric"`
}

type BrowseTagsResponseItem struct {
	Tag          string `json:"tag"`
	ArticleCount int    `json:"articleCount"` // article count
}

type BrowseTagsResponse struct {
	Tags []BrowseTagsResponseItem `json:"tags"`
}

// browse tags produced by articles
// GET /tags?keyword=$TARGET_TAG&limit=10
func BrowseTags(c echo.Context) error {
	cc := c.(*env.CustomContext)

	q := new(BrowseTagsQuery)
	if err := cc.Bind(q); err != nil {
		return MakeError(http.StatusBadRequest, "QUERY_NOT_READABLE")
	}

	if err := cc.Validate(q); err != nil {
		return err
	}

	// 1. do not use COUNT() as upper case letter.
	// 2. reassign count columns if possible(different db causes different count column name)
	ts := []BrowseTagsResponseItem{}
	db := cc.Db.Table("article_tags").Select("tag_value as tag, count(article_id) as article_count").Group("tag_value").Order("count(article_id) desc")
	if q.Keyword != "" {
		db = db.Where("tag_value LIKE ?", q.Keyword+"%")
	}
	if q.Limit != "" {
		lim, err := strconv.Atoi(q.Limit)
		if err != nil {
			return MakeError(http.StatusBadRequest, "QUERY_NOT_READABLE")
		}
		db = db.Limit(lim)
	}
	db.Scan(&ts)

	err := cc.JSON(http.StatusOK, BrowseTagsResponse{ts})
	if err != nil {
		return MakeError(http.StatusInternalServerError, "FAILED_MAKE_RESPONSE")
	}
	return err
}

// to figure out dates
// SELECT article_tags.tag_value, DATE(articles.created_at) AS created_date, COUNT(*) as count FROM public.article_tags
// INNER JOIN public.articles ON public.article_tags.article_id = public.articles.id
// GROUP BY article_tags.tag_value, DATE(articles.created_at)

type BrowseTagsByFrequencyResponse map[string]map[string]int // key is tag, row is { date: frequency }

// browse tags by its frequency
func BrowseTagsByFrequency(c echo.Context) error {
	cc := c.(*env.CustomContext)
	var res BrowseTagsByFrequencyResponse = make(BrowseTagsByFrequencyResponse)
	var results []struct {
		TagValue    string
		CreatedDate string
		Count       int
	}
	db := cc.Db.Table("article_tags").Select("tag_value, date(articles.created_at) as created_date, count(*) as count").Joins("join articles on article_tags.article_id = articles.id").Group("article_tags.tag_value, date(articles.created_at)")
	db.Scan(&results)
	for _, v := range results {
		if res[v.TagValue] == nil {
			res[v.TagValue] = make(map[string]int)
		}
		res[v.TagValue][v.CreatedDate] = v.Count
	}
	err := cc.JSON(http.StatusOK, res)
	return err
}
