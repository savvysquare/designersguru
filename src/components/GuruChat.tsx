import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Loader2, ShoppingCart, ChevronDown } from "lucide-react";
import { getSessionToken, parseCartFromMessage, checkInvoiceTrigger, extractClientInfo, LineItem } from "@/lib/chat-utils";
import InvoiceModal from "./InvoiceModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CartState {
  items: LineItem[];
  discountPct: number;
  total: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function GuruChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<CartState>({ items: [], discountPct: 0, total: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{
    clientName: string;
    clientEmail: string;
    lineItems: LineItem[];
    subtotal: number;
    discountPct: number;
    discountAmount: number;
    total: number;
    invoiceNumber: string;
    orderId: string;
  } | null>(null);
  const [sessionToken] = useState(() => getSessionToken());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting from Guru
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content:
              "Hey! 👋 I'm **Guru** — your project consultant at Guru Designers.\n\n**What brings you here today?**",
          },
        ]);
      }, 300);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const streamChat = useCallback(
    async (userMessage: string) => {
      const newMessages: Message[] = [
        ...messages,
        { role: "user" as const, content: userMessage },
      ];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      let assistantText = "";

      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/guru-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            sessionToken,
          }),
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
                  if (last?.role === "assistant") {
                    return prev.map((m, i) =>
                      i === prev.length - 1 ? { ...m, content: assistantText } : m
                    );
                  }
                  return [...prev, { role: "assistant", content: assistantText }];
                });
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        // Parse cart from final AI response
        const cartParsed = parseCartFromMessage(assistantText);
        if (cartParsed?.items && cartParsed.items.length > 0) {
          setCart({
            items: cartParsed.items,
            discountPct: 0,
            total: cartParsed.total || cartParsed.items.reduce((s, i) => s + i.price, 0),
          });
          setShowCart(true);
        }

        // Check if invoice should be generated
        if (checkInvoiceTrigger(assistantText)) {
          const { name, email } = extractClientInfo([...newMessages, { role: "assistant", content: assistantText }]);
          if (name && email && cart.items.length > 0) {
            await generateInvoice(name, email, cart);
          }
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Oops, I ran into a small issue — ${errMsg}. Please try again!`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, sessionToken, cart]
  );

  const generateInvoice = async (name: string, email: string, cartData: CartState) => {
    try {
      const subtotal = cartData.items.reduce((s, i) => s + i.price, 0);
      const discountAmount = subtotal * (cartData.discountPct / 100);
      const total = subtotal - discountAmount;
      const chatSummary = messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" | ")
        .slice(0, 500);

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          lineItems: cartData.items,
          discountPct: cartData.discountPct,
          sessionToken,
          chatSummary,
        }),
      });
      const data = await resp.json();
      if (data.success) {
        setInvoiceData(data.order);
        setShowInvoice(true);
      }
    } catch (err) {
      console.error("Invoice generation failed:", err);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    streamChat(input.trim());
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (text: string) => {
    // Remove invoice trigger
    text = text.replace(/<<<GENERATE_INVOICE>>>/g, "");
    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // Bullet points
    text = text.replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside space-y-1 my-2">${match}</ul>`);
    // Line breaks
    text = text.replace(/\n\n/g, "<br/><br/>");
    text = text.replace(/\n/g, "<br/>");
    return text;
  };

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Chat Window */}
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
                  >
                    G
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[hsl(0_0%_7%)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Guru</p>
                  <p className="text-xs text-muted-foreground">Guru Designers · Online now</p>
                </div>
                <div className="flex items-center gap-2">
                  {cart.items.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCart(!showCart)}
                      className="relative p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                        {cart.items.length}
                      </span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Mini Cart */}
              <AnimatePresence>
                {showCart && cart.items.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b border-border/50"
                    style={{ background: "hsl(0 0% 9%)" }}
                  >
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-between">
                        <span>📋 Your Package</span>
                        <button onClick={() => setShowCart(false)}>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </p>
                      {cart.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                          <span className="text-foreground font-medium whitespace-nowrap">
                            ${item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {cart.discountPct > 0 && (
                        <div className="flex justify-between text-sm py-1 text-green-400">
                          <span>Bundle Discount ({cart.discountPct}%)</span>
                          <span>
                            -${(cart.items.reduce((s, i) => s + i.price, 0) * cart.discountPct / 100).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2 mt-1 border-t border-border/50 font-semibold">
                        <span className="text-foreground">Total</span>
                        <span className="text-gradient-copper">${cart.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground mr-2 flex-shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
                      >
                        G
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-tr-sm text-primary-foreground"
                          : "rounded-tl-sm text-foreground"
                      }`}
                      style={
                        msg.role === "user"
                          ? { background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }
                          : { background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }
                      }
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        className="[&_ul]:pl-1 [&_li]:text-sm"
                      />
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start items-end gap-2"
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
                    >
                      G
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl rounded-tl-sm"
                      style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
                    >
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary/70"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Replies */}
              {messages.length <= 1 && !isLoading && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {[
                    "I need a website",
                    "AI automation help",
                    "Brand identity",
                    "Full package quote",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => streamChat(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-border/50">
                <div
                  className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
                  style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    disabled={isLoading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
                    style={{
                      background:
                        input.trim() && !isLoading
                          ? "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))"
                          : "hsl(0 0% 14%)",
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-white" />
                    )}
                  </motion.button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  Powered by Guru Designers · designers.guru
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      {showInvoice && invoiceData && (
        <InvoiceModal
          data={invoiceData}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
}
