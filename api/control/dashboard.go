package control

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rabelais88/portfolio2020/api/constants"
	"github.com/rabelais88/portfolio2020/api/env"
	"github.com/rabelais88/portfolio2020/api/model"
)

type DashboardResponse struct {
	ArticleCount int `json:"articleCount"`
	PostCount    int `json:"postCount"`
	WorkCount    int `json:"workCount"`
}

func GetDashboard(c echo.Context) error {
	// DO NOT EXPOSE ANY PRIVATE INFORMATION HERE
	cc := c.(*env.CustomContext)

	var articleCount int
	var postCount int
	var workCount int
	cc.Db.Find(&[]model.Article{}).Count(&articleCount)
	cc.Db.Where(&model.Article{Type: constants.ARTICLES.POST}).Find(&[]model.Article{}).Count(&postCount)
	cc.Db.Where(&model.Article{Type: constants.ARTICLES.WORK}).Find(&[]model.Article{}).Count(&workCount)
	err := cc.JSON(http.StatusOK, DashboardResponse{
		ArticleCount: articleCount,
		PostCount:    postCount,
		WorkCount:    workCount,
	})
	return err
}
