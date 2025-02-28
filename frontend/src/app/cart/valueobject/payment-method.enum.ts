export enum PaymentMethodEnum {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
}

export function addPaymentMethodToPrice(price: number, paymentMethod: PaymentMethodEnum): number {
  switch (paymentMethod) {
    case PaymentMethodEnum.CASH:
      return price + 50
    case PaymentMethodEnum.BANK_TRANSFER:
      return price
    case PaymentMethodEnum.CARD:
      return Math.round(price * 1.1)
    default:
      return price
  }
}
