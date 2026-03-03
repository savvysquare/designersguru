import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, ArrowLeft, Loader2, Shield, Clock } from "lucide-react";
import { LineItem } from "@/lib/chat-utils";

interface OrderData {
  clientName: string;
  clientEmail: string;
  lineItems: LineItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  total: number;
  invoiceNumber: string;
  orderId: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type PaymentState = "idle" | "processing" | "success" | "error";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [selectedMethod, setSelectedMethod] = useState<"paystack" | "paypal">("paystack");
  const [errorMsg, setErrorMsg] = useState("");
  const orderId = searchParams.get("order");

  useEffect(() => {
    const stored = sessionStorage.getItem("pending_order");
    if (stored) {
      setOrder(JSON.parse(stored));
    } else if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  const simulatePayment = async () => {
    if (!order) return;
    setPaymentState("processing");
    setErrorMsg("");

    try {
      // Simulate payment processing delay
      await new Promise((r) => setTimeout(r, 2500));

      // Generate a mock reference
      const mockRef = `TEST_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          reference: mockRef,
          orderId: order.orderId,
          method: selectedMethod,
        }),
      });

      const data = await resp.json();
      if (data.success) {
        sessionStorage.removeItem("pending_order");
        setPaymentState("success");
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (err) {
      setPaymentState("error");
      setErrorMsg(err instanceof Error ? err.message : "Payment failed. Please try again.");
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (paymentState === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, hsl(142 70% 45%), hsl(142 85% 55%))" }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-3">Payment Successful! 🎉</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Thank you, <strong>{order.clientName}</strong>! Your payment of{" "}
            <strong>${order.total.toLocaleString()} USD</strong> has been received.
            <br />
            <br />
            Our team will reach out to you at{" "}
            <strong>{order.clientEmail}</strong> within <strong>24 hours</strong> to kick off your
            project. We can't wait to build something amazing together! 🚀
          </p>

          {/* Receipt Summary */}
          <div
            className="rounded-2xl p-4 mb-6 text-left"
            style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 14%)" }}
          >
            <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
              Receipt Summary
            </p>
            {order.lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="text-foreground font-medium">${item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-3 mt-2 border-t border-border/50 font-bold">
              <span>Total Paid</span>
              <span className="text-gradient-copper">${order.total.toLocaleString()} USD</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Invoice: {order.invoiceNumber}
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-2xl text-sm font-medium text-foreground"
              style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div
        className="px-6 py-4 flex items-center justify-between border-b border-border/50"
        style={{ background: "hsl(0 0% 6%)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-green-500" />
          Secure Checkout
        </div>
        <div className="font-display font-bold text-sm">
          designers<span className="text-primary">.guru</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_380px] gap-8">
        {/* Payment Form */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">Complete Your Payment</h1>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["paystack", "paypal"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedMethod === method
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      selectedMethod === method
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  />
                  <span className="font-semibold text-sm text-foreground capitalize">{method}</span>
                  {method === "paystack" && (
                    <span
                      className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: "hsl(142 70% 45% / 0.2)", color: "hsl(142 70% 55%)" }}
                    >
                      TEST
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {method === "paystack"
                    ? "Pay with card, bank transfer or USSD"
                    : "Pay via PayPal sandbox (test mode)"}
                </p>
              </button>
            ))}
          </div>

          {/* TEST MODE Banner */}
          <div
            className="rounded-2xl p-4 mb-6 flex items-start gap-3"
            style={{ background: "hsl(43 100% 50% / 0.08)", border: "1px solid hsl(43 100% 50% / 0.2)" }}
          >
            <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">Test Mode Active</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                This is a sandbox environment. No real money will be charged. Click "Complete Test Payment" to simulate a successful payment.
              </p>
            </div>
          </div>

          {/* Test card info */}
          {selectedMethod === "paystack" && (
            <div
              className="rounded-2xl p-4 mb-6"
              style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 14%)" }}
            >
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Test Card Details
              </p>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Number</span>
                  <span className="text-foreground">4084 0840 8408 4081</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry</span>
                  <span className="text-foreground">Any future date</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CVV</span>
                  <span className="text-foreground">408</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PIN</span>
                  <span className="text-foreground">0000</span>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 mb-4"
              style={{ background: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.3)" }}
            >
              <p className="text-sm text-red-400">{errorMsg}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={simulatePayment}
            disabled={paymentState === "processing"}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-primary-foreground font-semibold disabled:opacity-70 transition-all"
            style={{
              background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))",
              boxShadow: "0 4px 20px hsl(25 85% 55% / 0.4)",
            }}
          >
            {paymentState === "processing" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Complete Test Payment — ${order.total.toLocaleString()} USD
              </>
            )}
          </motion.button>
        </div>

        {/* Order Summary */}
        <div>
          <div
            className="rounded-3xl overflow-hidden sticky top-6"
            style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 14%)" }}
          >
            <div className="px-6 py-4 border-b border-border/50">
              <p className="font-semibold text-foreground">Order Summary</p>
              <p className="text-xs text-muted-foreground mt-1">{order.invoiceNumber}</p>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Client</p>
                <p className="text-sm font-medium text-foreground">{order.clientName}</p>
                <p className="text-sm text-muted-foreground">{order.clientEmail}</p>
              </div>
              <div className="space-y-3 mb-4">
                {order.lineItems.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: "hsl(25 85% 55%)" }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground">${item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/50 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toLocaleString()}</span>
                </div>
                {order.discountPct > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Bundle Discount ({order.discountPct}%)</span>
                    <span>−${order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border/50">
                  <span className="text-foreground">Total</span>
                  <span className="text-gradient-copper">${order.total.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  SSL-secured 256-bit encryption
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Valid for 7 days from issue date
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
