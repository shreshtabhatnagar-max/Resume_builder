package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.entity.Payment;
import com.example.Resume_Builder.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) throws RazorpayException {
        //Step 1: Validate the request method
        String razorpayOrderId = request.get("razorpay_order_id");
        String razorpayPaymentId = request.get("razorpay_payment_id");
        String razorpaySignature = request.get("razorpay_signature");
        if (Objects.isNull(razorpayOrderId) ||
                Objects.isNull(razorpayPaymentId) ||
                Objects.isNull(razorpaySignature)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required payment parameters"));
        }

        //Step 2: call the service method
        boolean isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);


        //Step 3: return the response
        if (isValid) {
            return ResponseEntity.ok(Map.of(
                    "message", "Payment verified successfully",
                    "status", "success"
            ));
        } else {
            return  ResponseEntity.badRequest().body(Map.of("message","Payment Verification failed"));
        }

    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(Authentication authentication) {
        //Step 1: call the Service method
        List<Payment> payments= paymentService.getUserPayments(authentication.getPrincipal());
        //Step 2:return the response
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId) {
        //Step 1: Call the Service method
        Payment paymentDetails=paymentService.getPaymentDetails(orderId);
        //Step 2: return response
        return ResponseEntity.ok(paymentDetails);

    }
}
