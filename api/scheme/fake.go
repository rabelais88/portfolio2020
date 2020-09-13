package scheme

import (
	"math/rand"
	"time"

	"github.com/brianvoe/gofakeit"
)

func getAYearAgo() time.Time {
	_now := time.Now()
	return _now.AddDate(-1, 0, 0)
}

func getRandomizedDate() time.Time {
	return gofakeit.DateRange(getAYearAgo(), time.Now())
}

func MakeFakeTags() []Tag {
	var tags []Tag
	for t := 0; t < rand.Intn(10); t++ {
		tags = append(tags, Tag{
			Value:     gofakeit.BuzzWord(),
			CreatedAt: getRandomizedDate(),
		})
	}
	return tags
}
