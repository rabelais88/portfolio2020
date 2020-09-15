package model

import (
	"log"

	"github.com/jinzhu/gorm"
	"github.com/rs/xid"
)

type Article struct {
	ID string `gorm:"primary_key" json:"id"`
	NewGormModel
	Type       string `gorm:"default:'unknown'" json:"type"`
	Title      string `gorm:"default:'untitled'" json:"title"`
	Desc       string `json:"desc"`
	CoverImage string `json:"coverImage"`
	Link       string `json:"link"`
	Tags       []Tag  `gorm:"many2many:article_tags;association_foreignkey:value;foreign_key:iD;" json:"tags"`
}

func (article *Article) BeforeCreate(scope *gorm.Scope) error {
	uid := xid.New().String()
	err := scope.SetColumn("ID", uid)
	if err != nil {
		// handle error
		log.Println("error while creating UUID(article)")
	}
	return nil
}
