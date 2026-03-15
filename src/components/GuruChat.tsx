import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, MessageCircle, Loader2, ShoppingCart, ChevronDown,
  CheckCircle, Shield, Copy, Check, User, Mail, Phone, Building2, Globe
} from "lucide-react";
import { getSessionToken, parseCartFromMessage, checkInvoiceTrigger, checkContactTrigger, LineItem } from "@/lib/chat-utils";

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

// Tranche plans — Full Payment and 60/40 Split
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
    id: "60-40",
    label: "60 / 40 Split",
    description: "60% now to start, 40% on delivery",
    badge: "Popular",
    badgeColor: "hsl(25 85% 55%)",
    getTranches: (total: number) => [
      { label: "Deposit (60%)", amount: Math.round(total * 0.6), pct: 60 },
      { label: "Final Payment (40%)", amount: Math.round(total * 0.4), pct: 40 },
    ],
  },
];

// Bank account details
const BANK_ACCOUNTS = {
  international: {
    label: "International",
    flag: "🌍",
    fields: [
      { label: "Bank", value: "Lead Bank" },
      { label: "Account Name", value: "Olayemi Awoyemi" },
      { label: "Account Number", value: "219684676460" },
      { label: "Wire Routing", value: "101019644" },
      { label: "ACH Routing", value: "101019644" },
      { label: "Account Type", value: "Checking" },
      { label: "Bank Address", value: "1801 Main St., Kansas City, MO 64108" },
    ],
  },
  nigerian: {
    label: "Nigerian",
    flag: "🇳🇬",
    fields: [
      { label: "Bank", value: "Moniepoint MFB" },
      { label: "Account Name", value: "Olayemi Awoyemi" },
      { label: "Account Number", value: "9061989669" },
    ],
  },
};

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
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            : <>Generate My Invoice</>
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
            Payment details ready below ↓
          </div>
        )}

        <p className="text-[10px] text-center text-muted-foreground">
          <Shield className="w-3 h-3 inline mr-1" />
          Secure invoice · 7-day validity
        </p>
      </div>
    </motion.div>
  );
}

// ─── Copyable Field ───────────────────────────────────────────────────────────
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl group cursor-pointer"
      style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)" }}
      onClick={handleCopy}
    >
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
        <p className="text-xs font-medium text-foreground">{value}</p>
      </div>
      <div
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
        style={{ background: copied ? "hsl(142 70% 45% / 0.15)" : "hsl(0 0% 12%)" }}
      >
        {copied
          ? <Check className="w-3 h-3 text-green-400" />
          : <Copy className="w-3 h-3 text-muted-foreground" />
        }
      </div>
    </div>
  );
}

// ─── In-chat Payment Card ─────────────────────────────────────────────────────
function PaymentCard({ data }: { data: InvoiceData }) {
  const [selectedPlan, setSelectedPlan] = useState("full");
  const [selectedRegion, setSelectedRegion] = useState<"international" | "nigerian">("international");
  const [ngnRate, setNgnRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  const isNigerian = selectedRegion === "nigerian";

  // Fetch live NGN rate whenever Nigerian tab is selected
  useEffect(() => {
    if (!isNigerian || ngnRate !== null) return;
    setRateLoading(true);
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((d) => {
        if (d?.rates?.NGN) setNgnRate(d.rates.NGN);
      })
      .catch(() => setNgnRate(1600)) // fallback rate
      .finally(() => setRateLoading(false));
  }, [isNigerian, ngnRate]);

  const formatAmt = (usd: number) => {
    if (isNigerian && ngnRate) {
      const ngn = Math.round(usd * ngnRate);
      return `₦${ngn.toLocaleString("en-NG")}`;
    }
    return `$${usd.toLocaleString()} USD`;
  };

  const plan = TRANCHE_PLANS.find((p) => p.id === selectedPlan)!;
  const tranches = plan.getTranches(data.total);
  const account = BANK_ACCOUNTS[selectedRegion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl overflow-hidden my-2"
      style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 18%)" }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/40">
        <p className="text-sm font-semibold text-foreground">How to Pay</p>
        <p className="text-xs text-muted-foreground">
          {data.invoiceNumber} · ${data.total.toLocaleString()} USD total
          {isNigerian && ngnRate && (
            <span className="ml-1" style={{ color: "hsl(142 70% 55%)" }}>
              · ₦{Math.round(data.total * ngnRate).toLocaleString("en-NG")}
            </span>
          )}
        </p>
      </div>

      <div className="px-4 py-3 space-y-4">
        {/* Payment Plan */}
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Payment Plan</p>
          <div className="space-y-2">
            {TRANCHE_PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
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
                  <p className="text-[10px] text-muted-foreground">{p.description}</p>
                </div>
                <span className="text-xs font-bold text-foreground whitespace-nowrap">
                  {rateLoading && isNigerian
                    ? <Loader2 className="w-3 h-3 animate-spin inline" />
                    : formatAmt(p.getTranches(data.total)[0].amount)
                  } now
                </span>
              </button>
            ))}
          </div>

          {/* Schedule breakdown */}
          {tranches.length > 1 && (
            <div className="mt-2 rounded-xl p-2.5 space-y-1.5" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 13%)" }}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Payment Schedule</p>
              {tranches.map((t, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? "hsl(25 85% 55%)" : "hsl(0 0% 30%)" }} />
                    <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>{t.label}</span>
                  </div>
                  <span className={i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}>
                    {formatAmt(t.amount)}
                  </span>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                ⚡ Work starts after 1st payment · delivered before final payment is due
              </p>
            </div>
          )}
        </div>

        {/* Region selector */}
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Your Location</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(BANK_ACCOUNTS) as Array<keyof typeof BANK_ACCOUNTS>).map((key) => {
              const acc = BANK_ACCOUNTS[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className="px-3 py-2.5 rounded-xl border text-left transition-all"
                  style={{
                    borderColor: selectedRegion === key ? "hsl(25 85% 55% / 0.6)" : "hsl(0 0% 16%)",
                    background: selectedRegion === key ? "hsl(25 85% 55% / 0.07)" : "transparent",
                  }}
                >
                  <p className="text-sm">{acc.flag}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{acc.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account details */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            {selectedRegion === "international"
              ? <Globe className="w-3 h-3 text-muted-foreground" />
              : <Building2 className="w-3 h-3 text-muted-foreground" />
            }
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {account.label} Bank Account — tap any field to copy
            </p>
          </div>
          <div className="space-y-1.5">
            {account.fields.map((field) => (
              <CopyField key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </div>

        {/* Amount to transfer */}
        <div className="rounded-xl p-3" style={{ background: "hsl(25 85% 55% / 0.08)", border: "1px solid hsl(25 85% 55% / 0.2)" }}>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Amount to Transfer Now</p>
          {rateLoading && isNigerian ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: "hsl(25 85% 65%)" }} />
              <span className="text-sm text-muted-foreground">Fetching live rate…</span>
            </div>
          ) : (
            <>
              <p className="text-lg font-bold" style={{ color: "hsl(25 85% 65%)" }}>
                {formatAmt(tranches[0].amount)}
              </p>
              {isNigerian && ngnRate && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  ≈ ${tranches[0].amount.toLocaleString()} USD · rate: ₦{Math.round(ngnRate).toLocaleString()}/$ (live)
                </p>
              )}
            </>
          )}
          <p className="text-[10px] text-muted-foreground mt-0.5">{tranches[0].label}</p>
        </div>

        {/* After transfer note */}
        <div className="rounded-xl p-3 space-y-2.5" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)" }}>
          <p className="text-xs font-semibold text-foreground">After you transfer:</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Send us your proof of payment — we'll confirm receipt and kick off your project within <strong className="text-foreground">24 hours</strong>.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <a
              href="mailto:hello@designers.guru?subject=Proof%20of%20Payment&body=Hi%20Guru%20Designers%2C%0A%0AI%20have%20made%20a%20transfer%20and%20I%27m%20attaching%20my%20proof%20of%20payment%20below."
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: "hsl(25 85% 55% / 0.12)",
                border: "1px solid hsl(25 85% 55% / 0.35)",
                color: "hsl(25 85% 65%)",
              }}
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              hello@designers.guru
            </a>
            <a
              href="https://wa.me/2349061989669?text=Hi%20Guru%20Designers!%20I%27ve%20just%20made%20a%20transfer%20and%20I%27m%20sending%20my%20proof%20of%20payment."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: "hsl(142 70% 45% / 0.10)",
                border: "1px solid hsl(142 70% 45% / 0.35)",
                color: "hsl(142 70% 55%)",
              }}
            >
              <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
              WhatsApp: +234 906 198 9669
            </a>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">
          <Shield className="w-3 h-3 inline mr-1" />
          Bank transfer · Your details are used solely for project delivery
        </p>
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
  const [invoiceGenerating, setInvoiceGenerating] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [sessionToken] = useState(() => getSessionToken());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const cartRef = useRef<CartState>({ items: [], discountPct: 0, total: 0 });
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { cartRef.current = cart; }, [cart]);

  // Listen for external "open-guru-chat" event (e.g. from hero/contact buttons)
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-guru-chat", handler);
    return () => window.removeEventListener("open-guru-chat", handler);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ role: "assistant", content: "Hey! 👋 I'm **Guru** — your project consultant at Guru Designers.\n\n**What brings you here today?**" }]);
      }, 300);
    }
  }, [isOpen, messages.length]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading, showInvoice, showPayment, showContactForm, invoiceGenerating, invoiceError]);
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

      // Contact collection trigger → show contact form
      if (checkContactTrigger(assistantText) && !showContactForm && !showInvoice) {
        setShowContactForm(true);
      }

      // Legacy invoice trigger fallback
      if (checkInvoiceTrigger(assistantText) && !showContactForm && !showInvoice) {
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
    const latestCart = cartRef.current.items.length > 0 ? cartRef.current : { items: [], discountPct: 0, total: 0 };
    await generateInvoice(name, email, phone, latestCart);
  };

  const generateInvoice = async (name: string, email: string, phone: string, cartData: CartState) => {
    setInvoiceGenerating(true);
    setInvoiceError("");
    try {
      const chatSummary = messagesRef.current
        .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
        .join("\n\n")
        .slice(0, 5000);

      let lineItems = cartData.items;
      if (lineItems.length === 0) {
        for (let i = messagesRef.current.length - 1; i >= 0; i--) {
          const msg = messagesRef.current[i];
          if (msg.role === "assistant") {
            const parsed = parseCartFromMessage(msg.content);
            if (parsed?.items && parsed.items.length > 0) {
              lineItems = parsed.items;
              break;
            }
          }
        }
      }

      if (lineItems.length === 0) {
        lineItems = [{ name: "Custom Project (details TBD)", description: "Scope to be confirmed", price: 0 }];
      }

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          lineItems,
          discountPct: cartData.discountPct,
          sessionToken,
          chatSummary,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || "Failed to generate invoice. Please try again.");
      }
      setShowContactForm(false);
      setInvoiceData({
        clientName: data.order.clientName,
        clientEmail: data.order.clientEmail,
        clientPhone: phone,
        lineItems: data.order.lineItems,
        subtotal: data.order.subtotal,
        discountPct: data.order.discountPct,
        discountAmount: data.order.discountAmount || 0,
        total: data.order.total,
        invoiceNumber: data.order.invoiceNumber,
        orderId: data.order.id,
      });
      setShowInvoice(true);
      setShowPayment(true);
    } catch (err) {
      console.error("Invoice generation failed:", err);
      setInvoiceError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setInvoiceGenerating(false);
    }
  };

  const formatMessage = (text: string) => {
    text = text.replace(/<<<GENERATE_INVOICE>>>/g, "").replace(/<<<COLLECT_CONTACT>>>/g, "").trim();
    const paragraphs = text.split(/\n\n+/);
    const formattedParagraphs = paragraphs.map((para, idx) => {
      let p = para;
      p = p.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      p = p.replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>");
      p = p.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc list-inside space-y-1 my-1">${m}</ul>`);
      p = p.replace(/\n/g, "<br/>");
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

                {/* Contact Form */}
                {(showContactForm || invoiceGenerating) && !showInvoice && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="flex-1 min-w-0">
                      {showContactForm && !invoiceGenerating && (
                        <ContactFormCard onSubmit={handleContactFormSubmit} />
                      )}
                      {invoiceGenerating && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full rounded-2xl px-4 py-4 flex items-center gap-3"
                          style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(25 85% 55% / 0.3)" }}
                        >
                          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" style={{ color: "hsl(25 85% 55%)" }} />
                          <div>
                            <p className="text-sm font-semibold text-foreground">Generating your invoice…</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Just a moment</p>
                          </div>
                        </motion.div>
                      )}
                      {invoiceError && !invoiceGenerating && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full rounded-2xl px-4 py-3 space-y-2"
                          style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 84% 60% / 0.4)" }}
                        >
                          <p className="text-xs text-red-400">{invoiceError}</p>
                          <button
                            onClick={() => { setInvoiceError(""); setShowContactForm(true); }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                            style={{ background: "hsl(25 85% 55% / 0.15)", color: "hsl(25 85% 65%)" }}
                          >Try again</button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Invoice */}
                {showInvoice && invoiceData && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="flex-1 min-w-0">
                      <InvoiceCard data={invoiceData} autoShowPayment={showPayment} />
                    </div>
                  </div>
                )}

                {/* Payment / Bank Details */}
                {showPayment && invoiceData && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                    <div className="flex-1 min-w-0">
                      <PaymentCard data={invoiceData} />
                    </div>
                  </div>
                )}

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
