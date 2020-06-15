interface queryPaging {
  page: number;
  order?: 'asc' | 'desc';
  sort?: string;
  size?: number;
}

export default queryPaging;
