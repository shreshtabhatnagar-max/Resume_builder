import apiClient from "@/lib/axios";
import { Payment, CreateOrderResponse } from "@/types";

export const paymentService = {
  createOrder: async (planType: string): Promise<CreateOrderResponse> => {
    const res = await apiClient.post("/api/payment/create-order", { planType });
    return res.data;
  },

  verifyPayment: async (params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ message: string; status: string }> => {
    const res = await apiClient.post("/api/payment/verify", params);
    return res.data;
  },

  getPaymentHistory: async (): Promise<Payment[]> => {
    const res = await apiClient.get("/api/payment/history");
    return res.data;
  },

  getOrderDetails: async (orderId: string): Promise<Payment> => {
    const res = await apiClient.get(`/api/payment/order/${orderId}`);
    return res.data;
  },
};
