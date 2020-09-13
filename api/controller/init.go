package controller

import (
	"log"

	"github.com/meilisearch/meilisearch-go"
	"github.com/rabelais88/portfolio2020/api/scheme"
	"gorm.io/gorm"
)

func (_controller Controller) InitDatabase() {
	// DB migration
	err := _controller.DB.AutoMigrate(&scheme.Article{})
	if err != nil {
		log.Printf("error while migrating...%v", err)
	}
	err = _controller.DB.AutoMigrate(&scheme.Tag{})
	if err != nil {
		log.Printf("error while migrating...%v", err)
	}

}

func (_controller Controller) InitMeili() {

	// meilisearch indexing
	index, err := _controller.Meili.Indexes().Get("articles")
	if err != nil {
		log.Printf("error while getting search indices...%v", err)
	}

	if index == nil {
		log.Printf("articles index not found...creating new index")
		_, err = _controller.Meili.Indexes().Create(meilisearch.CreateIndexRequest{
			UID:        "articles",
			PrimaryKey: "urlSlug",
		})
		if err != nil {
			log.Printf("error while creating new index...%v", err)
		}
	}

	articles := []scheme.Article{}
	_controller.DB.FindInBatches(&articles, 20, func(tx *gorm.DB, batch int) error {
		articleIndices := []map[string]interface{}{}
		for _, article := range articles {
			articleIndices = append(articleIndices, *scheme.ArticleToSearch(&article))
		}
		updateRes, err := _controller.Meili.Documents("article").AddOrUpdate(articleIndices)
		if err != nil {
			return err
		}
		log.Printf("%v", updateRes)
		return nil
	})
}
