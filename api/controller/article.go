package controller

import (
	"errors"
	"log"
	"net/http"

	"gorm.io/gorm"

	"github.com/meilisearch/meilisearch-go"
	"github.com/rabelais88/portfolio2020/api/scheme"
)

type GetArticlesArg struct {
	Size                  int64
	Page                  int64
	Query                 string
	AttributesToHighlight []string
}

func (_controller Controller) GetArticles(arg GetArticlesArg) (*meilisearch.SearchResponse, error) {
	// 	{
	//     "hits": [
	//         {
	//             "book_id": 456,
	//             "title": "Le Petit Prince",
	//             "_formatted": {
	//                 "book_id": 456,
	//                 "title": "Le Petit <em>Prince</em>"
	//             }
	//         }
	//     ],
	//     "offset": 0,
	//     "limit": 1,
	//     "processingTimeMs": 0,
	//     "query": "prince"
	// }

	query := meilisearch.SearchRequest{
		Offset: arg.Page * arg.Size,
		Limit:  (arg.Page + 1) * arg.Size,
	}
	if arg.Query != "" {
		query.Query = arg.Query
		query.AttributesToHighlight = []string{"title", "content", "tags"}
	}
	resp, err := _controller.Meili.Search("articles").Search(query)
	if err != nil {
		return nil, MakeError(http.StatusInternalServerError, "SEARCH_ERROR")
	}
	return resp, nil
}

func (_controller Controller) GetArticleFromDB(URLSlug string) (*scheme.ArticleView, error) {
	log.Printf("picked up urlslug %s", URLSlug)
	a := scheme.Article{}
	err := _controller.DB.Where(&scheme.Article{
		URLSlug: URLSlug,
	}).Preload("Tags").First(&a).Error
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, MakeError(http.StatusBadRequest, "DOCUMENT_NOT_EXIST")
	}

	log.Printf("found document, %v", a)
	return scheme.ArticleToView(&a), nil
}

func (_controller Controller) GetArticleFromMeili(URLSlug string) (*map[string]interface{}, error) {
	log.Printf("GetArticle with URLSlug %s", URLSlug)
	article := map[string]interface{}{}
	err := _controller.Meili.Documents("articles").Get(URLSlug, &article)
	if err != nil {
		log.Printf("error while fetching documents from Meili server %v", err)
		return nil, MakeError(http.StatusInternalServerError, "ERROR_MEILI_SEARCH")
	}
	log.Printf("GetArticle fetched successfully ...%v", article)
	return &article, nil
}

func (_controller Controller) WriteArticle(article *scheme.Article) (*scheme.ArticleView, error) {

	err := _controller.DB.Where(&scheme.Article{URLSlug: article.URLSlug}).First(&scheme.Article{}).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, MakeError(http.StatusBadRequest, "URL_SLUG_ALREADY_EXIST")
	}

	_controller.DB.Create(article)
	_controller.DB.Save(article)

	if _controller.MeiliDisabled {
		log.Println("meili disabled...return article")
		return scheme.ArticleToView(article), nil
	}

	log.Printf("writeArticle data - %v", article)
	meiliDoc := []map[string]interface{}{*scheme.ArticleToSearch(article)}
	log.Printf("meili doc %v", meiliDoc)
	_, err = _controller.Meili.Documents("articles").AddOrUpdate(meiliDoc)
	if err != nil {
		log.Printf("%v", err)
		return nil, MakeError(http.StatusInternalServerError, "ERROR_MEILI_ADD")
	}
	return scheme.ArticleToView(article), nil
}
