package cz.tul.sti2024.cv.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class Payment {
    private float amount;
    private String currency;
    private Date date;
    private String paymentType;
    private List<String> items;
    public synchronized Payment readPayment(String payload, ObjectMapper objectMapper) throws JsonProcessingException {
        return objectMapper.readValue(payload, Payment.class);
    }
}
