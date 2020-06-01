package constants

const (
	WORK   = "WORK"
	POST   = "POST"
	NOTICE = "NOTICE"
	MEDIA  = "PHOTO"
)

type _articles struct {
	WORK   string
	POST   string
	NOTICE string
	MEDIA  string
}

var ARTICLES = &_articles{
	WORK:   WORK,
	POST:   POST,
	NOTICE: NOTICE,
	MEDIA:  MEDIA,
}
