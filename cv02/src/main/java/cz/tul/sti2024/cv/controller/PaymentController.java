package cz.tul.sti2024.cv.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.tul.sti2024.cv.model.Payment;
import cz.tul.sti2024.cv.services.PaymentProcessingHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;


@RestController
public class PaymentController {
    private PaymentProcessingHandler paymentProcessingHandler;

    public PaymentController(PaymentProcessingHandler paymentProcessingHandler){
        this.paymentProcessingHandler = paymentProcessingHandler;
    }
    @RequestMapping("/")
    public String hello() {
        return "Hello world";
    }

    @RequestMapping("/time")
    public String getTime() {
        return new Date(System.currentTimeMillis()).toString();
    }

    @RequestMapping(value = "/pay", method = RequestMethod.POST)
    public String paymentProcessing(String payload) {
        try {
            paymentProcessingHandler.ProcessPayment(payload);
            return "Payment accepted";
        }catch(JsonProcessingException jsonProcessingException){
            return "Payment rejected";
        }
    }
}

