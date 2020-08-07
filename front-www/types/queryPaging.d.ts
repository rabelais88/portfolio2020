interface queryPaging {
  page?: number;
  order?: 'asc' | 'desc';
  sort?: string;
  size?: number;
  keyword?: string;
}

export default queryPaging;
