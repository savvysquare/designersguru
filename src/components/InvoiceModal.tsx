import { motion, AnimatePresence } from "framer-motion";
import { X, Download, CreditCard, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineItem } from "@/lib/chat-utils";

interface InvoiceData {
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

export default function InvoiceModal({
  data,
  onClose,
}: {
  data: InvoiceData;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const handlePayNow = () => {
    // Pass invoice data via URL params (safe for non-sensitive data) + sessionStorage for details
    sessionStorage.setItem("pending_order", JSON.stringify(data));
    navigate(`/checkout?order=${data.orderId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: "hsl(0 0% 7%)",
            border: "1px solid hsl(0 0% 16%)",
            boxShadow: "0 32px 80px hsl(0 0% 0% / 0.7)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-5 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, hsl(25 85% 55% / 0.15), hsl(35 100% 70% / 0.08))", borderBottom: "1px solid hsl(0 0% 14%)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-primary-foreground"
                style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
              >
                GD
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Guru Designers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: "hsl(25 85% 55% / 0.15)", color: "hsl(25 85% 65%)" }}
              >
                INVOICE
              </span>
              <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Invoice meta */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Billed to</p>
                <p className="font-semibold text-foreground">{data.clientName}</p>
                <p className="text-sm text-muted-foreground">{data.clientEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{data.invoiceNumber}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Due {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid hsl(0 0% 14%)" }}
            >
              <div className="px-4 py-2.5 text-xs text-muted-foreground grid grid-cols-[1fr_auto] gap-4 border-b border-border/50">
                <span>Description</span>
                <span className="text-right">Amount</span>
              </div>
              {data.lineItems.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 grid grid-cols-[1fr_auto] gap-4"
                  style={{ borderBottom: i < data.lineItems.length - 1 ? "1px solid hsl(0 0% 10%)" : "none" }}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">${item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${data.subtotal.toLocaleString()}</span>
              </div>
              {data.discountPct > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Bundle Discount ({data.discountPct}%)</span>
                  <span>−${data.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div
                className="flex justify-between text-base font-bold pt-3 mt-1 border-t border-border/50"
              >
                <span className="text-foreground">Total Due</span>
                <span className="text-gradient-copper">${data.total.toLocaleString()} USD</span>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayNow}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-primary-foreground font-semibold text-sm"
              style={{
                background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))",
                boxShadow: "0 4px 20px hsl(25 85% 55% / 0.4)",
              }}
            >
              <CreditCard className="w-4 h-4" />
              Pay Now — ${data.total.toLocaleString()} USD
            </motion.button>

            <p className="text-center text-xs text-muted-foreground">
              🔒 Secure checkout powered by Paystack &amp; PayPal
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
