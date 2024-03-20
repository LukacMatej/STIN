package cz.tul.sti2024.cv.services;

import org.springframework.stereotype.Component;

@Component
public class PaymentServiceProcessing {
    public void pay(String payment){
        System.out.println(payment);
    }
}
