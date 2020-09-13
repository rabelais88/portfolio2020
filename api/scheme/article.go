package scheme

import (
	"log"
	"strings"
	"time"

	"github.com/brianvoe/gofakeit/v5"
	"github.com/mitchellh/mapstructure"
	"github.com/novalagung/gubrak/v2"
	"github.com/rs/xid"
	"gorm.io/gorm"
)

// gorm.Model definition
// type Model struct {
//   ID        uint           `gorm:"primaryKey"`
//   CreatedAt time.Time
//   UpdatedAt time.Time
//   DeletedAt gorm.DeletedAt `gorm:"index"`
// }

func MakeID() string {
	return xid.New().String()
}

type Article struct {
	ID        string `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Type      string
	Title     string
	Content   string
	Image     string
	Link      string
	Tags      []Tag  `gorm:"many2many:article_tags;"`
	URLSlug   string `gorm:"index"`
}

func (a *Article) BeforeCreate(tx *gorm.DB) (err error) {
	a.ID = MakeID()
	return
}

type ArticleTags struct {
	ArticleID string
	TagID     string
	CreatedAt time.Time
	DeletedAt time.Time
}

type ArticleView struct {
	ID        string         `json:"id" mapstructure:"id"`
	CreatedAt time.Time      `json:"createdAt" mapstructure:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt" mapstructure:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" mapstructure:"deletedAt,squash"`
	Type      string         `json:"type" mapstructure:"type"`
	Title     string         `json:"title" mapstructure:"title"`
	Content   string         `json:"content" mapstructure:"content,omitempty"`
	Image     string         `json:"image" mapstructure:"image,omitempty"`
	Link      string         `json:"link" mapstructure:"link,omitempty"`
	Tags      []string       `json:"tags" mapstructure:"tags"`
	URLSlug   string         `json:"urlSlug" mapstructure:"urlSlug"`
}

func TagsToStringArray(tags []Tag) []string {
	return gubrak.From(tags).Map(func(t Tag) string {
		return t.Value
	}).Result().([]string)
}

func ArticleToSearch(article *Article) *map[string]interface{} {
	// tagValues := TagsToStringArray(article.Tags)
	aView := ArticleToView(article)
	result := &map[string]interface{}{}
	err := mapstructure.Decode(aView, &result)
	if err != nil {
		log.Printf("Error while converting struct to map[string]")
	}
	return result
}

func ArticleToView(article *Article) *ArticleView {
	tagValues := TagsToStringArray(article.Tags)
	return &ArticleView{
		ID:        article.ID,
		Title:     article.Title,
		Content:   article.Content,
		Type:      article.Type,
		Image:     article.Image,
		URLSlug:   article.URLSlug,
		CreatedAt: article.CreatedAt,
		UpdatedAt: article.UpdatedAt,
		DeletedAt: article.DeletedAt,
		Tags:      tagValues,
		Link:      article.Link,
	}
}

func MakeFakePost() Article {
	title := gofakeit.Sentence(5)
	URLslug := strings.ReplaceAll(title, " ", "-") + xid.New().String()
	return Article{
		Title:   title,
		Content: gofakeit.Paragraph(4, 4, 10, "\n"),
		Type:    `POST`,
		Image:   gofakeit.ImageURL(320, 240),
		URLSlug: URLslug,
		Tags:    MakeFakeTags(),
	}
}
