import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, MessageCircle, Loader2, ShoppingCart, ChevronDown,
  CreditCard, CheckCircle, Shield, Copy, Check, Banknote, User, Mail, Phone
} from "lucide-react";
import { getSessionToken, parseCartFromMessage, checkInvoiceTrigger, LineItem } from "@/lib/chat-utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CartState {
  items: LineItem[];
  discountPct: number;
  total: number;
}

interface InvoiceData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  lineItems: LineItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  total: number;
  invoiceNumber: string;
  orderId: string;
}

interface ReceiptData {
  invoiceNumber: string;
  amountPaid: number;
  totalPaid: number;
  remaining: number;
  isFullyPaid: boolean;
  trancheLabel: string;
  trancheIndex: number;
  totalTranches: number;
  method: string;
  reference: string;
  paidAt: string;
}

// Tranche plans
const TRANCHE_PLANS = [
  {
    id: "full",
    label: "Pay in Full",
    description: "One payment — best value",
    badge: "Recommended",
    badgeColor: "hsl(142 70% 45%)",
    getTranches: (total: number) => [{ label: "Full Payment", amount: total, pct: 100 }],
  },
  {
    id: "50-50",
    label: "50 / 50 Split",
    description: "50% now to start, 50% on delivery",
    badge: "Popular",
    badgeColor: "hsl(25 85% 55%)",
    getTranches: (total: number) => [
      { label: "Deposit (50%)", amount: Math.round(total * 0.5), pct: 50 },
      { label: "Final Payment (50%)", amount: Math.round(total * 0.5), pct: 50 },
    ],
  },
  {
    id: "33-33-33",
    label: "3-Part Plan",
    description: "33% now, 33% midway, 33% on delivery",
    badge: "Flexible",
    badgeColor: "hsl(217 91% 60%)",
    getTranches: (total: number) => {
      const third = Math.floor(total / 3);
      return [
        { label: "1st Payment (33%)", amount: third, pct: 33 },
        { label: "2nd Payment (33%)", amount: third, pct: 33 },
        { label: "Final Payment (34%)", amount: total - third * 2, pct: 34 },
      ];
    },
  },
];

const PAYMENT_METHODS = [
  { id: "paystack", label: "Card / Bank Transfer", sub: "Paystack · TEST MODE" },
  { id: "paypal", label: "PayPal", sub: "Sandbox · TEST MODE" },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// ─── In-chat Contact Form Card ────────────────────────────────────────────────
function ContactFormCard({ onSubmit }: { onSubmit: (name: string, email: string, phone: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Please enter your full name";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Please enter a valid email";
    if (!phone.trim() || phone.trim().length < 6) e.phone = "Please enter your phone number";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    onSubmit(name.trim(), email.trim(), phone.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="w-full rounded-2xl overflow-hidden my-2"
      style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(25 85% 55% / 0.3)" }}
    >
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{ background: "linear-gradient(135deg, hsl(25 85% 55% / 0.12), hsl(35 100% 70% / 0.06))", borderBottom: "1px solid hsl(0 0% 15%)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground"
          style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
        >
          <User className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Your Details</p>
          <p className="text-[10px] text-muted-foreground">Almost there — just need these to generate your invoice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-3 space-y-3">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
            placeholder="John Smith"
            autoComplete="name"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
            style={{
              background: "hsl(0 0% 7%)",
              border: `1px solid ${errors.name ? "hsl(0 84% 60% / 0.6)" : "hsl(0 0% 18%)"}`,
            }}
            onFocus={e => (e.target.style.borderColor = "hsl(25 85% 55% / 0.6)")}
            onBlur={e => (e.target.style.borderColor = errors.name ? "hsl(0 84% 60% / 0.6)" : "hsl(0 0% 18%)")}
          />
          {errors.name && <p className="text-[10px] text-red-400">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            <Mail className="w-3 h-3" /> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
            placeholder="john@company.com"
            autoComplete="email"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
            style={{
              background: "hsl(0 0% 7%)",
              border: `1px solid ${errors.email ? "hsl(0 84% 60% / 0.6)" : "hsl(0 0% 18%)"}`,
            }}
            onFocus={e => (e.target.style.borderColor = "hsl(25 85% 55% / 0.6)")}
            onBlur={e => (e.target.style.borderColor = errors.email ? "hsl(0 84% 60% / 0.6)" : "hsl(0 0% 18%)")}
          />
          {errors.email && <p className="text-[10px] text-red-400">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            <Phone className="w-3 h-3" /> Phone / WhatsApp
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
            placeholder="+1 234 567 8900"
            autoComplete="tel"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all"
            style={{
              background: "hsl(0 0% 7%)",
              border: `1px solid ${errors.phone ? "hsl(0 84% 60% / 0.6)" : "hsl(0 0% 18%)"}`,
            }}
            onFocus={e => (e.target.style.borderColor = "hsl(25 85% 55% / 0.6)")}
            onBlur={e => (e.target.style.borderColor = errors.phone ? "hsl(0 84% 60% / 0.6)" : "hsl(0 0% 18%)")}
          />
          {errors.phone && <p className="text-[10px] text-red-400">{errors.phone}</p>}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={submitting}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-primary-foreground font-semibold text-sm disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))",
            boxShadow: "0 4px 16px hsl(25 85% 55% / 0.35)",
          }}
        >
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Invoice...</>
            : <><CreditCard className="w-4 h-4" /> Generate My Invoice</>
          }
        </motion.button>
        <p className="text-[10px] text-center text-muted-foreground">
          <Shield className="w-3 h-3 inline mr-1" />
          Your details are secure and private
        </p>
      </form>
    </motion.div>
  );
}

// ─── In-chat Invoice Card ─────────────────────────────────────────────────────
function InvoiceCard({
  data,
  autoShowPayment,
}: {
  data: InvoiceData;
  autoShowPayment?: boolean;
}) {
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="w-full rounded-2xl overflow-hidden my-2"
      style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 18%)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, hsl(25 85% 55% / 0.12), hsl(35 100% 70% / 0.06))", borderBottom: "1px solid hsl(0 0% 15%)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground"
            style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
          >
            GD
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Guru Designers</p>
            <p className="text-[10px] text-muted-foreground">designers.guru</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground font-mono">{data.invoiceNumber}</p>
          <p className="text-[10px] text-muted-foreground">
            Due {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Billed to */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Billed to</p>
          <p className="text-sm font-semibold text-foreground">{data.clientName}</p>
          <p className="text-xs text-muted-foreground">{data.clientEmail}</p>
          {data.clientPhone && <p className="text-xs text-muted-foreground">{data.clientPhone}</p>}
        </div>

        {/* Line items */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(0 0% 14%)" }}>
          {data.lineItems.map((item, i) => (
            <div
              key={i}
              className="px-3 py-2.5 flex justify-between items-start"
              style={{ borderBottom: i < data.lineItems.length - 1 ? "1px solid hsl(0 0% 12%)" : "none" }}
            >
              <div>
                <p className="text-xs font-medium text-foreground">{item.name}</p>
                {item.description && <p className="text-[10px] text-muted-foreground mt-0.5">{item.description}</p>}
              </div>
              <p className="text-xs font-semibold text-foreground ml-2 whitespace-nowrap">${item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1">
          {data.discountPct > 0 && (
            <div className="flex justify-between text-xs text-green-400">
              <span>Bundle Discount ({data.discountPct}%)</span>
              <span>−${data.discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1 border-t border-border/40">
            <span className="text-sm font-bold text-foreground">Total Due</span>
            <span className="text-sm font-bold" style={{ color: "hsl(25 85% 65%)" }}>
              ${data.total.toLocaleString()} USD
            </span>
          </div>
        </div>

        {autoShowPayment && (
          <div className="rounded-xl px-3 py-2 text-[10px] text-green-400 flex items-center gap-1.5"
            style={{ background: "hsl(142 70% 45% / 0.08)", border: "1px solid hsl(142 70% 45% / 0.2)" }}>
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            Payment options ready below ↓
          </div>
        )}

        <p className="text-[10px] text-center text-muted-foreground">
          <Shield className="w-3 h-3 inline mr-1" />
          Secure payment · 7-day validity
        </p>
      </div>
    </motion.div>
  );
}

// ─── In-chat Payment Card ─────────────────────────────────────────────────────
function PaymentCard({
  data,
  onPaid,
}: {
  data: InvoiceData;
  onPaid: (receipt: ReceiptData, nextTranche?: { label: string; amount: number } | null) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState("full");
  const [selectedMethod, setSelectedMethod] = useState("paystack");
  const [currentTranche, setCurrentTranche] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [paidTranches, setPaidTranches] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const plan = TRANCHE_PLANS.find((p) => p.id === selectedPlan)!;
  const tranches = plan.getTranches(data.total);
  const currentT = tranches[currentTranche];
  const allPaid = paidTranches.length === tranches.length;

  const handlePay = async () => {
    setProcessing(true);
    setError("");
    await new Promise((r) => setTimeout(r, 2000));
    const ref = `TEST_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          reference: ref,
          orderId: data.orderId,
          method: selectedMethod,
          amountPaid: currentT.amount,
          trancheIndex: currentTranche,
          totalTranches: tranches.length,
          trancheLabel: currentT.label,
        }),
      });
      const result = await resp.json();
      if (!result.success) throw new Error(result.error || "Payment failed");
      const newPaid = [...paidTranches, currentTranche];
      setPaidTranches(newPaid);
      const nextIdx = currentTranche + 1;
      const nextTranche = nextIdx < tranches.length ? tranches[nextIdx] : null;
      onPaid(result.receiptData, nextTranche);
      if (nextTranche) setCurrentTranche(nextIdx);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const copyTestCard = () => {
    navigator.clipboard.writeText("4084084084084081");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (allPaid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl overflow-hidden my-2"
      style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 18%)" }}
    >
      <div className="px-4 py-3 border-b border-border/40">
        <p className="text-sm font-semibold text-foreground">Complete Payment</p>
        <p className="text-xs text-muted-foreground">{data.invoiceNumber} · ${data.total.toLocaleString()} USD total</p>
      </div>

      <div className="px-4 py-3 space-y-4">
        {/* Tranche plan selector */}
        {paidTranches.length === 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Payment Plan</p>
            <div className="space-y-2">
              {TRANCHE_PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPlan(p.id); setCurrentTranche(0); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all"
                  style={{
                    borderColor: selectedPlan === p.id ? "hsl(25 85% 55% / 0.6)" : "hsl(0 0% 16%)",
                    background: selectedPlan === p.id ? "hsl(25 85% 55% / 0.07)" : "transparent",
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all"
                    style={{
                      borderColor: selectedPlan === p.id ? "hsl(25 85% 55%)" : "hsl(0 0% 35%)",
                      background: selectedPlan === p.id ? "hsl(25 85% 55%)" : "transparent",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{p.label}</span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: `${p.badgeColor}22`, color: p.badgeColor }}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{p.description}</p>
                  </div>
                  <span className="text-xs font-bold text-foreground whitespace-nowrap">
                    ${plan.id === p.id ? currentT?.amount.toLocaleString() : p.getTranches(data.total)[0].amount.toLocaleString()} now
                  </span>
                </button>
              ))}
            </div>

            {/* Tranche breakdown preview */}
            {tranches.length > 1 && (
              <div className="mt-2 rounded-xl p-2.5 space-y-1" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 13%)" }}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Payment Schedule</p>
                {tranches.map((t, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? "hsl(25 85% 55%)" : "hsl(0 0% 30%)" }} />
                      <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>{t.label}</span>
                    </div>
                    <span className={i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}>${t.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-1.5 mt-1 border-t border-border/30 text-[10px] text-muted-foreground">
                  ⚡ Work starts after 1st payment · delivered before final payment is due
                </div>
              </div>
            )}
          </div>
        )}

        {/* Currently paying tranche */}
        {paidTranches.length > 0 && (
          <div className="rounded-xl p-2.5" style={{ background: "hsl(142 70% 45% / 0.08)", border: "1px solid hsl(142 70% 45% / 0.2)" }}>
            <p className="text-xs text-green-400 font-semibold">
              ✓ {paidTranches.length} of {tranches.length} payments completed
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Now paying: {currentT?.label}</p>
          </div>
        )}

        {/* Payment method */}
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Payment Method</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className="px-3 py-2 rounded-xl border text-left transition-all"
                style={{
                  borderColor: selectedMethod === m.id ? "hsl(25 85% 55% / 0.6)" : "hsl(0 0% 16%)",
                  background: selectedMethod === m.id ? "hsl(25 85% 55% / 0.07)" : "transparent",
                }}
              >
                <p className="text-xs font-medium text-foreground">{m.label}</p>
                <p className="text-[10px] text-muted-foreground">{m.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Test card hint */}
        {selectedMethod === "paystack" && (
          <button
            onClick={copyTestCard}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all"
            style={{ background: "hsl(217 91% 60% / 0.07)", border: "1px solid hsl(217 91% 60% / 0.2)" }}
          >
            <span className="text-blue-400">🧪 Test card: 4084 0840 8408 4081</span>
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
          </button>
        )}

        {error && (
          <p className="text-xs text-red-400 px-2">{error}</p>
        )}

        {/* Pay button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePay}
          disabled={processing}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-primary-foreground font-semibold text-sm disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))",
            boxShadow: "0 4px 16px hsl(25 85% 55% / 0.35)",
          }}
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
          ) : (
            <><Banknote className="w-4 h-4" /> Pay ${currentT?.amount.toLocaleString()} USD — {currentT?.label}</>
          )}
        </motion.button>

        <p className="text-[10px] text-center text-muted-foreground">
          <Shield className="w-3 h-3 inline mr-1" />
          TEST MODE — no real charge · Paystack &amp; PayPal sandbox
        </p>
      </div>
    </motion.div>
  );
}

// ─── In-chat Receipt Card ─────────────────────────────────────────────────────
function ReceiptCard({
  receipt,
  clientName,
  nextTranche,
}: {
  receipt: ReceiptData;
  clientName: string;
  nextTranche?: { label: string; amount: number } | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="w-full rounded-2xl overflow-hidden my-2"
      style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(142 70% 45% / 0.3)" }}
    >
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: "hsl(142 70% 45% / 0.08)", borderBottom: "1px solid hsl(142 70% 45% / 0.2)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "hsl(142 70% 45% / 0.2)" }}
        >
          <CheckCircle className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-green-400">
            {receipt.isFullyPaid ? "Payment Complete! 🎉" : `${receipt.trancheLabel} Received ✓`}
          </p>
          <p className="text-[10px] text-muted-foreground">{receipt.invoiceNumber}</p>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Paid now</span>
            <span className="font-semibold text-foreground">${receipt.amountPaid.toLocaleString()} USD</span>
          </div>
          {!receipt.isFullyPaid && (
            <>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total paid so far</span>
                <span className="font-semibold text-foreground">${receipt.totalPaid.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Remaining balance</span>
                <span className="font-semibold" style={{ color: "hsl(25 85% 65%)" }}>${receipt.remaining.toLocaleString()} USD</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Method</span>
            <span className="text-foreground capitalize">{receipt.method}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Reference</span>
            <span className="text-foreground font-mono text-[10px]">{receipt.reference.slice(0, 20)}...</span>
          </div>
        </div>

        {receipt.isFullyPaid ? (
          <div
            className="rounded-xl p-3 mt-1 text-xs space-y-1"
            style={{ background: "hsl(142 70% 45% / 0.06)", border: "1px solid hsl(142 70% 45% / 0.2)" }}
          >
            <p className="text-green-400 font-semibold">🚀 You're all set, {clientName}!</p>
            <p className="text-muted-foreground"><strong className="text-foreground">We will contact you immediately we see your payment</strong> — usually within minutes.</p>
            <p className="text-muted-foreground text-[10px]">Check your inbox for a confirmation email.</p>
          </div>
        ) : nextTranche ? (
          <div
            className="rounded-xl p-2.5 text-xs"
            style={{ background: "hsl(25 85% 55% / 0.07)", border: "1px solid hsl(25 85% 55% / 0.2)" }}
          >
            <p className="text-muted-foreground">
              Next: <strong className="text-foreground">{nextTranche.label}</strong> — ${nextTranche.amount.toLocaleString()} USD
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5"><strong className="text-foreground">We will contact you immediately</strong> we see your first payment and keep you updated before each milestone.</p>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

// ─── Main GuruChat Component ──────────────────────────────────────────────────
export default function GuruChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<CartState>({ items: [], discountPct: 0, total: 0 });
  const [showCart, setShowCart] = useState(false);

  // In-chat UI states
  const [showContactForm, setShowContactForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [receipts, setReceipts] = useState<{ receipt: ReceiptData; nextTranche: { label: string; amount: number } | null }[]>([]);

  const [sessionToken] = useState(() => getSessionToken());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ role: "assistant", content: "Hey! 👋 I'm **Guru** — your project consultant at Guru Designers.\n\n**What brings you here today?**" }]);
      }, 300);
    }
  }, [isOpen, messages.length]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading, showInvoice, showPayment, showContactForm, receipts]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const streamChat = useCallback(async (userMessage: string) => {
    const newMessages: Message[] = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    let assistantText = "";

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/guru-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ messages: newMessages, sessionToken }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error || `HTTP ${resp.status}`);
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m);
                return [...prev, { role: "assistant", content: assistantText }];
              });
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }

      // Parse cart
      const cartParsed = parseCartFromMessage(assistantText);
      if (cartParsed?.items && cartParsed.items.length > 0) {
        setCart({ items: cartParsed.items, discountPct: 0, total: cartParsed.total || cartParsed.items.reduce((s, i) => s + i.price, 0) });
        setShowCart(true);
      }

      // Invoice trigger → show contact form instead of extracting from text
      if (checkInvoiceTrigger(assistantText) && cart.items.length > 0 && !showContactForm && !showInvoice) {
        setShowContactForm(true);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [...prev, { role: "assistant", content: `Oops — ${errMsg}. Please try again!` }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionToken, cart, showContactForm, showInvoice]);

  const handleContactFormSubmit = async (name: string, email: string, phone: string) => {
    setShowContactForm(false);
    await generateInvoice(name, email, phone, cart);
  };

  const generateInvoice = async (name: string, email: string, phone: string, cartData: CartState) => {
    try {
      const subtotal = cartData.items.reduce((s, i) => s + i.price, 0);
      const discountAmount = subtotal * (cartData.discountPct / 100);
      const total = subtotal - discountAmount;
      const chatSummary = messages.filter((m) => m.role === "user").map((m) => m.content).join(" | ").slice(0, 500);

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ clientName: name, clientEmail: email, lineItems: cartData.items, discountPct: cartData.discountPct, sessionToken, chatSummary }),
      });
      const data = await resp.json();
      if (data.success) {
        setInvoiceData({ ...data.order, clientPhone: phone, discountAmount: data.order.discountAmount || 0 });
        setShowInvoice(true);
        setShowPayment(true); // auto-show payment immediately
        setReceipts([]);
      }
    } catch (err) { console.error("Invoice generation failed:", err); }
  };

  const handlePaid = (receipt: ReceiptData, nextTranche: { label: string; amount: number } | null) => {
    setReceipts((prev) => [...prev, { receipt, nextTranche }]);
    if (receipt.isFullyPaid) {
      setShowPayment(false);
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `🎉 **Payment confirmed, ${invoiceData?.clientName}!**\n\nYour project is now locked in. Our team is already excited to get started.\n\n**We will contact you immediately — watch your inbox and phone for our message within minutes!**`,
        }]);
      }, 500);
    }
  };

  // Format message — bold last paragraph, handle markdown
  const formatMessage = (text: string) => {
    text = text.replace(/<<<GENERATE_INVOICE>>>/g, "").trim();

    // Split into paragraphs
    const paragraphs = text.split(/\n\n+/);
    const formattedParagraphs = paragraphs.map((para, idx) => {
      let p = para;
      // Bold inline **text**
      p = p.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      // Lists
      p = p.replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>");
      p = p.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc list-inside space-y-1 my-1">${m}</ul>`);
      // Inline newlines
      p = p.replace(/\n/g, "<br/>");
      // Bold the last paragraph
      if (idx === paragraphs.length - 1 && paragraphs.length > 1) {
        p = `<strong>${p}</strong>`;
      }
      return p;
    });

    return formattedParagraphs.join("<br/><br/>");
  };

  const handleSend = () => { if (!input.trim() || isLoading) return; streamChat(input.trim()); };
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-primary-foreground text-sm font-semibold shadow-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))",
              boxShadow: "0 8px 32px hsl(25 85% 55% / 0.45), 0 2px 8px hsl(0 0% 0% / 0.3)",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-7 h-7"
            >
              <span className="absolute inset-0 rounded-full bg-white/25 animate-ping" />
              <MessageCircle className="w-5 h-5 relative z-10" />
            </motion.span>
            <span className="hidden sm:block">💬 Talk to Guru</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed inset-x-4 bottom-4 top-16 z-50 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[680px] flex flex-col rounded-3xl overflow-hidden"
              style={{
                background: "hsl(0 0% 7%)",
                border: "1px solid hsl(0 0% 14%)",
                boxShadow: "0 24px 80px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(25 85% 55% / 0.1)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 py-4 border-b border-border/50"
                style={{ background: "linear-gradient(135deg, hsl(0 0% 9%), hsl(0 0% 7%))" }}
              >
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold text-primary-foreground"
                    style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
                  >G</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[hsl(0_0%_7%)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Guru</p>
                  <p className="text-xs text-muted-foreground">Guru Designers · Online now</p>
                </div>
                <div className="flex items-center gap-2">
                  {cart.items.length > 0 && (
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowCart(!showCart)}
                      className="relative p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                        {cart.items.length}
                      </span>
                    </motion.button>
                  )}
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Mini Cart */}
              <AnimatePresence>
                {showCart && cart.items.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b border-border/50" style={{ background: "hsl(0 0% 9%)" }}
                  >
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-between">
                        <span>📋 Your Package</span>
                        <button onClick={() => setShowCart(false)}><ChevronDown className="w-3 h-3" /></button>
                      </p>
                      {cart.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                          <span className="text-foreground font-medium whitespace-nowrap">${item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm pt-2 mt-1 border-t border-border/50 font-semibold">
                        <span className="text-foreground">Total</span>
                        <span style={{ color: "hsl(25 85% 65%)" }}>${cart.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    )}
                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "rounded-tr-sm text-primary-foreground" : "rounded-tl-sm text-foreground"}`}
                      style={msg.role === "user"
                        ? { background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }
                        : { background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }
                      }>
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} className="[&_ul]:pl-1 [&_li]:text-sm" />
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}>
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* In-chat Contact Form */}
                {showContactForm && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="flex-1 min-w-0">
                      <ContactFormCard onSubmit={handleContactFormSubmit} />
                    </div>
                  </div>
                )}

                {/* In-chat Invoice */}
                {showInvoice && invoiceData && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="flex-1 min-w-0">
                      <InvoiceCard data={invoiceData} autoShowPayment={showPayment} />
                    </div>
                  </div>
                )}

                {/* In-chat Payment */}
                {showPayment && invoiceData && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="flex-1 min-w-0">
                      <PaymentCard data={invoiceData} onPaid={handlePaid} />
                    </div>
                  </div>
                )}

                {/* Receipts */}
                {receipts.map((r, i) => (
                  <div key={i} className="flex justify-start">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="flex-1 min-w-0">
                      <ReceiptCard receipt={r.receipt} clientName={invoiceData?.clientName || ""} nextTranche={r.nextTranche} />
                    </div>
                  </div>
                ))}

                <div ref={bottomRef} />
              </div>

              {/* Quick Replies */}
              {messages.length <= 1 && !isLoading && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {["I need a website", "AI automation help", "Brand identity", "Full package quote"].map((q) => (
                    <button key={q} onClick={() => streamChat(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
                  style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}>
                  <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                    placeholder="Type a message..." disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSend} disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
                    style={{ background: input.trim() && !isLoading ? "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" : "hsl(0 0% 14%)" }}>
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /> : <Send className="w-3.5 h-3.5 text-white" />}
                  </motion.button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">Powered by Guru Designers · designers.guru</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
