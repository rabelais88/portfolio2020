package model

type Tag struct {
	NewGormModel
	Value    string     `gorm:"primary_key:true;" json:"value"`
	Articles []*Article `gorm:"many2many:article_tags;"`
}
