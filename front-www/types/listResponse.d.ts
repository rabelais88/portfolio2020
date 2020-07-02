interface listResponse<T> {
  count: number;
  page: number;
  // next: number;
  // prev: number;
  pages: number[];
  list: T[];
}

export default listResponse;
