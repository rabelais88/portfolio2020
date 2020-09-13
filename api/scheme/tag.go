package scheme

import (
	"time"

	"gorm.io/gorm"
)

type Tag struct {
	ID        string `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Value     string         `gorm:"primaryKey"`
}

func (t *Tag) BeforeCreate(tx *gorm.DB) (err error) {
	t.ID = MakeID()
	return
}
