interface listResponse<T> {
  count: number;
  page: number;
  next: number;
  prev: number;
  pages: number[];
  items: T[];
}

export default listResponse;
