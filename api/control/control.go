package control

type PagingQuery struct {
	After  *string `query:"after" json:"after" validate:"omitempty,alphanum"`
	Before *string `query:"before" json:"before" validate:"omitempty,alphanum"`
	Limit  *int    `query:"limit" json:"limit" validate:"omitempty,numeric"`
	Order  *string `query:"order" json:"order" validate:"omitempty,oneof=asc desc"`
}

type PagedResponse struct {
	Count  int    `json:"count"`
	Cursor string `json:"cursor"`
	// add .List here
}
