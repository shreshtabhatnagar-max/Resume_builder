package com.example.Resume_Builder.service;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.entity.Payment;
import com.example.Resume_Builder.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.example.Resume_Builder.util.AppConstants.PREMIUM;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final AuthService authService;
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public Payment createOrder(Object principal, String planType) throws RazorpayException {

        //Initial Step
        AuthResponse authResponse = authService.getProfile(principal);

        //Step 1: Initialize the razorpay client
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        //Step 2:Prepare the Json Object to pass the razorpay
        int amount = 99900;//Amount in paise
        String currency = "INR";
        String receipt = PREMIUM + "_" + UUID.randomUUID().toString().substring(0, 8);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);


        //Step 3: call the razorpay API to create order
        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        //Step 4: Save the order details into databases
        Payment newPayment =Payment.builder()
                .userId(authResponse.getId())
                .razorpayOrderId(razorpayOrder.get("id"))
                .amount(amount)
                .currency(currency)
                .planType(planType)
                .status("Created")
                .receipt(receipt)
                .build();

        //Step 5: return the result
         return paymentRepository.save(newPayment);
    }
}
