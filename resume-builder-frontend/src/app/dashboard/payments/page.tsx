"use client";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { CreditCard, Receipt } from "lucide-react";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentService.getPaymentHistory,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Billing & Payments</h1>
        <p className="text-[var(--muted-foreground)]">Your payment history and receipts.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : payments && payments.length > 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[var(--muted-foreground)]" />
            <h2 className="font-display font-semibold">Transaction History</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {payments.map((payment) => (
              <div key={payment.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm capitalize">{payment.planType} Plan</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Order: {payment.razorpayOrderId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <span className="font-display font-bold">{payment.currency} {(payment.amount / 100).toFixed(2)}</span>
                  <Badge variant={payment.status === "captured" ? "success" : "warning"}>{payment.status}</Badge>
                  <span className="text-xs text-[var(--muted-foreground)]">{formatDate(payment.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-7 h-7 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">No payments yet</h2>
          <p className="text-[var(--muted-foreground)] text-sm max-w-xs mx-auto">Upgrade to Premium to unlock all features.</p>
        </div>
      )}
    </div>
  );
}
