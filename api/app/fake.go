package app

import (
	"log"
	"math/rand"
	"time"

	"github.com/brianvoe/gofakeit/v5"
	"github.com/jinzhu/gorm"
	"github.com/rabelais88/portfolio2020/api/model"
)

func getAYearAgo() time.Time {
	_now := time.Now()
	return _now.AddDate(-1, 0, 0)
}

func getRandomizedDate() time.Time {
	return gofakeit.DateRange(getAYearAgo(), time.Now())
}

func MakeFakeTags() []model.Tag {
	var tags []model.Tag
	for t := 0; t < rand.Intn(10); t++ {
		tags = append(tags, model.Tag{
			Value: gofakeit.BuzzWord(),
			NewGormModel: model.NewGormModel{
				CreatedAt: getRandomizedDate(),
			},
		})
	}
	return tags
}

func MakeFakePost(db *gorm.DB) {
	p := &model.Post{
		Article: &model.Article{
			Type:       "POST",
			Title:      gofakeit.Sentence(2),
			Desc:       gofakeit.Sentence(3),
			CoverImage: gofakeit.ImageURL(340, 240),
			Link:       gofakeit.URL(),
			Tags:       MakeFakeTags(),
			NewGormModel: model.NewGormModel{
				CreatedAt: getRandomizedDate(),
			},
		},
		Content: gofakeit.Paragraph(3, 2, 5, "<br />"),
	}
	db.Create(p)
}

func MakeFakeWork(db *gorm.DB) {
	w := &model.Article{
		Type:       "WORK",
		Title:      gofakeit.Sentence(2),
		Desc:       gofakeit.Sentence(3),
		CoverImage: gofakeit.ImageURL(340, 240),
		Link:       gofakeit.URL(),
		Tags:       MakeFakeTags(),
		NewGormModel: model.NewGormModel{
			CreatedAt: getRandomizedDate(),
		},
	}
	db.Create(w)
}

func MakeFakeData(db *gorm.DB) {
	var articles []model.Article
	var count int
	db.Find(&articles).Count(&count)
	if count >= 100 {
		log.Println("enough data already presents. fake db is not created")
		return
	}
	for i := 0; i < 100; i++ {
		rand.Seed(time.Now().UnixNano())

		_type := rand.Intn(2)
		_types := []string{"POST", "WORK"}
		switch _types[_type] {
		case "WORK":
			MakeFakeWork(db)
		default:
			MakeFakePost(db)
		}

	}
	log.Println("fake db created")
}
