import {CartSessionItemView} from './cart-session-item.model'

export interface CartItemCreateModel {
  bookId: number
  quantity: number
}

export function CartItemCreateModel(items: CartSessionItemView[]): CartItemCreateModel[] {
  return items.map(item => ({
    bookId: item.bookId,
    quantity: item.quantity
  }))
}
