package control

// type PagingQuery struct {
// 	After  *string `query:"after" json:"after" validate:"omitempty,alphanum"`
// 	Before *string `query:"before" json:"before" validate:"omitempty,alphanum"`
// 	Limit  *int    `query:"limit" json:"limit" validate:"omitempty,numeric"`
// 	Order  *string `query:"order" json:"order" validate:"omitempty,oneof=asc desc"`
// }

type PagingQuery struct {
	Page  int    `query:"page" json:"page" validate:"omitempty,numeric"`
	Order string `query:"order" json:"order" validate:"omitempty,oneof=asc desc"`
	Sort  string `query:"sort" json:"sort" validate:"omitempty,alphanum"`
	Size  int    `query:"size" json:"size" validate:"omitempty,numeric"`
}

type PagedResponse struct {
	Count int   `json:"count"`
	Page  int   `json:"page"`
	Next  int   `json:"next"`
	Prev  int   `json:"prev"`
	Pages []int `json:"pages"`
	// add .List here
}
