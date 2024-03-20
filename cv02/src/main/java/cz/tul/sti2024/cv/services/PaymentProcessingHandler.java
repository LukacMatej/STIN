package cz.tul.sti2024.cv.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import cz.tul.sti2024.cv.model.Payment;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class PaymentProcessingHandler {
    private HashMap<String, IPaymentService> paymentProcessingHandler;
    private final PaymentTransformations paymentTransformations;

    public PaymentProcessingHandler(CardPaymentService cardPaymentService, CashPaymentService cashPaymentService,
                                    PaymentTransformations paymentTransformations){
        this.paymentTransformations = paymentTransformations;
        paymentProcessingHandler = new HashMap<>();
        paymentProcessingHandler.put("CASH",cashPaymentService);
        paymentProcessingHandler.put("CARD", cardPaymentService);
    }

    public void processPayment(String payload) throws JsonProcessingException {
        Payment payment = paymentTransformations.transformJsonIntoPayment(payload);
        paymentProcessingHandler.get(payment.getPaymentType()).ProcessPayment(payment);
    }
}