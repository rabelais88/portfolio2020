package model

import (
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type Article struct {
	ID string `gorm:"primary_key" json:"id"`
	NewGormModel
	Type       string `gorm:"default:'unknown'" json:"type"`
	Title      string `gorm:"default:'untitled'" json:"title"`
	Desc       string `json:"desc"`
	CoverImage string `json:"coverImage"`
	Link       string `json:"link"`
}

func (article *Article) BeforeCreate(scope *gorm.Scope) error {
	_uuid := uuid.New().String()
	scope.SetColumn("ID", _uuid)
	return nil
}
