package model

type Article struct {
	ID         string `gorm:"primary_key" json:"id"`
	Type       string `gorm:"default:'unknown'" json:"type"`
	Title      string `gorm:"default:'untitled'" json:"title"`
	Desc       string `json:"desc"`
	CoverImage string `json:"coverImage"`
}
