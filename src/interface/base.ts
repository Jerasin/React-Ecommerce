export interface PaginationResponse<T> {
  response_key: string;
  response_message: string;
  data: T;
  totalPage: number;
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiResponse<T> {
  response_key: string;
  response_message: string;
  data: T;
}
