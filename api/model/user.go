package model

import (
	"log"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type User struct {
	NewGormModel
	UserID  string `gorm:"primary_key;unique;" json:"userId"`
	Email   string `json:"email"`
	Token   string `gorm:"unique;not null;" json:"token"`
	Role    string `json:"role"`
	Picture string `json:"picture"`
}

func (user *User) BeforeCreate(scope *gorm.Scope) error {
	_uuid := uuid.New().String()
	err := scope.SetColumn("UserID", _uuid)
	if err != nil {
		// handle error
		log.Println("error while creating UUID(user)")
	}
	return nil
}
