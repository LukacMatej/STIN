
/**
 * Record for a cart item. Contains the book id and the quantity.
 */
export interface CartSessionItem {
  bookId: number;
  quantity: number;
}

/**
 * View for a cart item. Contains the book id, the quantity, the title and the cost.
 */
export interface CartSessionItemView {
  bookId: number
  quantity: number
  title: string | undefined
  price: number | undefined
}
