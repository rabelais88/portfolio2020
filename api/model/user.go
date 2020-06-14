package model

type User struct {
	NewGormModel
	UserID string `gorm:"primary_key;" json:"userId"`
	Email  string `json:"email"`
	Token  string `gorm:"unique;not null;" json:"token"`
	Role   string `json:"role"`
}
