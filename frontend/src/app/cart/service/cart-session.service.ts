import {Injectable} from '@angular/core'

import {CartSessionItem} from '../model/cart-session-item.model'

/**
 * Key for the cart session storage.
 */
const cartKey = 'cart-key'

/**
 * Service for the cart session.  It allows to add a book to the cart and get the cart.
 */
@Injectable({
  providedIn: 'root'
})
export class CartSessionService {

  /**
   * Add a book to the cart session storage. Store the book id and quantity.
   *
   * @param bookId the book id to add
   * @param quantity the quantity to add
   * @param update if true, the quantity will be replaced by the new quantity
   */
  createOrUpdateBookInCart(bookId: number, quantity: number, update = false): void {
    const cart: CartSessionItem[] = JSON.parse(sessionStorage.getItem(cartKey) || '[]')
    const existingItem = cart.find(item => item.bookId === bookId)

    if (existingItem && update) {
      existingItem.quantity = quantity
    } else if (existingItem && !update) {
      existingItem.quantity += quantity
    } else {
      cart.push({bookId, quantity})
    }

    sessionStorage.setItem(cartKey, JSON.stringify(cart))
  }

  /**
   * Get the cart from the session storage.
   *
   * @returns the cart as a map
   */
  getCart(): CartSessionItem[] {
    return JSON.parse(sessionStorage.getItem(cartKey) || '[]')
  }

  /**
   * Get a specific cart item from the cart session storage.
   *
   * @param bookId
   * @returns the book or undefined
   */
  getItemFromCart(bookId: number): CartSessionItem | undefined {
    return this.getCart().find(item => item.bookId === bookId)
  }

  /**
   * Remove a book from the cart session storage.
   *
   * @param bookId
   */
  removeBookFromCart(bookId: number): void {
    let cart: CartSessionItem[] = JSON.parse(sessionStorage.getItem(cartKey) || '[]')
    cart = cart.filter(item => item.bookId !== bookId)

    sessionStorage.setItem(cartKey, JSON.stringify(cart))
  }

  /**
   * Clear the cart session storage.
   */
  clearCart(): void {
    sessionStorage.removeItem(cartKey)
  }
}
