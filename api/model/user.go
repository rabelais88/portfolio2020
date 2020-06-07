package model

type User struct {
	NewGormModel
	UserID string `gorm:"primary_key;" json:"userId"`
	Token  string `json:"token"`
}
