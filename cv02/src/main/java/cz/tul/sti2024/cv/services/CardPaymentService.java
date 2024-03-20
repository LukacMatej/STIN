package cz.tul.sti2024.cv.services;

import cz.tul.sti2024.cv.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class CardPaymentService implements IPaymentService {
    private final PaymentServiceProcessing paymentServiceProcessing;

    public CardPaymentService(PaymentServiceProcessing paymentServiceProcessing) {
        this.paymentServiceProcessing = paymentServiceProcessing;
    }

    @Override
    public void ProcessPayment(Payment payment) {
        String toPay = payment.getAmount() + "/" + payment.getCurrency();
        paymentServiceProcessing.pay(toPay);
    }
}