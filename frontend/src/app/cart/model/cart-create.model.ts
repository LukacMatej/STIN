import {PaymentMethodEnum} from '../valueobject/payment-method.enum'
import {CartItemCreateModel} from './cart-item-create.model'

export class CartCreateModel {
  paymentMethod: PaymentMethodEnum
  cartItems: CartItemCreateModel[]

  constructor(paymentMethod: PaymentMethodEnum, cartItems: CartItemCreateModel[]) {
    this.paymentMethod = paymentMethod
    this.cartItems = cartItems
  }
}
