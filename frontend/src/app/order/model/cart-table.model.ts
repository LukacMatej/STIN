import {PaymentMethodEnum} from '../../cart/valueobject/payment-method.enum'
import {CartItemTableModel} from './cart-item-table.model'

export interface CartTableModel {
  id: number
  paymentMethod: PaymentMethodEnum
  totalPrice: number
  createdDateTime: Date
  carItems: CartItemTableModel[]
}
