interface listResponse<T> {
  cursor: number;
  totalCount: number;
  pageSize: number;
  items: T[];
}

export default listResponse;
