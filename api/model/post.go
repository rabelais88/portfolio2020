package model

type Post struct {
	NewGormModel
	ArticleID string   `gorm:"primary_key;foreignkey:ArticleID;" json:"articleId"`
	Article   *Article `json:"article,omitempty"`
	Content   string   `json:"content"`
}
