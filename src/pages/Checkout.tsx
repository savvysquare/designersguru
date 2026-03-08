import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Clock, Copy, Check, Globe, Building2 } from "lucide-react";
import { Loader2 } from "lucide-react";
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

const BANK_ACCOUNTS = {
  international: {
    label: "International",
    flag: "🌍",
    subtitle: "Wire / ACH Transfer (USD)",
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
    subtitle: "Bank Transfer (NGN)",
    fields: [
      { label: "Bank", value: "Moniepoint MFB" },
      { label: "Account Name", value: "Olayemi Awoyemi" },
      { label: "Account Number", value: "9061989669" },
    ],
  },
};

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl cursor-pointer group transition-all"
      style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 16%)" }}
      onClick={handleCopy}
    >
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
      <div
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
        style={{ background: copied ? "hsl(142 70% 45% / 0.15)" : "hsl(0 0% 13%)" }}
      >
        {copied
          ? <Check className="w-4 h-4 text-green-400" />
          : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        }
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<"international" | "nigerian">("international");
  const orderId = searchParams.get("order");

  useEffect(() => {
    const stored = sessionStorage.getItem("pending_order");
    if (stored) {
      setOrder(JSON.parse(stored));
    } else if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const account = BANK_ACCOUNTS[selectedRegion];

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
        {/* Payment Instructions */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Bank Transfer Details</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Select your location to see the right bank details, then transfer the amount shown. Tap any field to copy it.
          </p>

          {/* Region toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(Object.keys(BANK_ACCOUNTS) as Array<keyof typeof BANK_ACCOUNTS>).map((key) => {
              const acc = BANK_ACCOUNTS[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className="p-4 rounded-2xl border text-left transition-all"
                  style={{
                    borderColor: selectedRegion === key ? "hsl(25 85% 55% / 0.6)" : "hsl(0 0% 18%)",
                    background: selectedRegion === key ? "hsl(25 85% 55% / 0.07)" : "transparent",
                  }}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className="w-4 h-4 rounded-full border-2 transition-all"
                      style={{
                        borderColor: selectedRegion === key ? "hsl(25 85% 55%)" : "hsl(0 0% 35%)",
                        background: selectedRegion === key ? "hsl(25 85% 55%)" : "transparent",
                      }}
                    />
                    <span className="text-lg">{acc.flag}</span>
                    <span className="font-semibold text-sm text-foreground">{acc.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">{acc.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Account fields */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {selectedRegion === "international"
                ? <Globe className="w-4 h-4 text-muted-foreground" />
                : <Building2 className="w-4 h-4 text-muted-foreground" />
              }
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                {account.label} Bank Account Details
              </p>
            </div>
            <div className="space-y-2">
              {account.fields.map((field) => (
                <CopyField key={field.label} label={field.label} value={field.value} />
              ))}
            </div>
          </div>

          {/* Amount box */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: "hsl(25 85% 55% / 0.08)", border: "1px solid hsl(25 85% 55% / 0.25)" }}
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Amount to Transfer</p>
            <p className="text-3xl font-bold" style={{ color: "hsl(25 85% 65%)" }}>
              ${order.total.toLocaleString()} USD
            </p>
            <p className="text-xs text-muted-foreground mt-1">Invoice {order.invoiceNumber}</p>
          </div>

          {/* After transfer instructions */}
          <div
            className="rounded-2xl p-5 space-y-2"
            style={{ background: "hsl(0 0% 9%)", border: "1px solid hsl(0 0% 16%)" }}
          >
            <p className="text-sm font-semibold text-foreground">After you transfer:</p>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Send your proof of payment (screenshot or receipt) to <strong className="text-foreground">hello@designers.guru</strong></li>
              <li>Or reach us via WhatsApp with the same proof</li>
              <li>We'll confirm receipt and kick off your project within <strong className="text-foreground">24 hours</strong></li>
            </ol>
          </div>
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
                  <span style={{ color: "hsl(25 85% 65%)" }}>${order.total.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Bank transfer · No card fees
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Valid for 7 days from issue date
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full mt-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground transition-all"
            style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    </div>
  );
}
