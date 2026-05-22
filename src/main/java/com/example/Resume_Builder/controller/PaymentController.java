package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.entity.Payment;
import com.example.Resume_Builder.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.example.Resume_Builder.util.AppConstants.PREMIUM;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> request, Authentication authentication) throws RazorpayException {

        //Step 0: Validate the Request
        String planType = request.get("planType");
        if (!PREMIUM.equalsIgnoreCase(planType)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid plan type"));
        }

        //Step 1: call the service method
        Payment payment = paymentService.createOrder(authentication.getPrincipal(), planType);

        //Step 2: prepare the Response Object
        Map<String, Object> response = Map.of("OrderId", payment.getRazorpayOrderId(),
                "amount", payment.getAmount(), "currency", payment.getCurrency(),
                "receipt", payment.getReceipt());

        //Step 3: return the response
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        return null;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(Authentication authentication) {
        return null;
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId) {
        return null;
    }
}
