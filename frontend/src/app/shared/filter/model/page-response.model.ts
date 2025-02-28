export interface PageResponseModel<T> {
  content: T[],
  totalPages: number,
  page: number,
  size: number,
  isEmpty: boolean
}
