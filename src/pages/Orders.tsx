import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ChevronDown,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Loader2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface ClientInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface Order {
  id: string;
  invoice_number: string;
  services_summary: string;
  line_items: Array<{ name: string; description: string; price: number }>;
  subtotal_usd: number;
  discount_pct: number;
  discount_usd: number;
  total_usd: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  admin_notes: string | null;
  chat_summary: string | null;
  created_at: string;
  clients: ClientInfo | null;
}

// Normalize Supabase join result (can be array or object)
function getClient(raw: unknown): ClientInfo | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as ClientInfo) ?? null;
  return raw as ClientInfo;
}

const STATUS_STYLES: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  invoiced: { label: "Invoiced", class: "bg-blue-100 text-blue-700 border-blue-200" },
  awaiting_payment: { label: "Awaiting Payment", class: "bg-orange-100 text-orange-700 border-orange-200" },
  deposit_paid: { label: "60% Paid · 40% Due", class: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "Fully Paid", class: "bg-green-100 text-green-700 border-green-200" },
  in_progress: { label: "In Progress", class: "bg-purple-100 text-purple-700 border-purple-200" },
  completed: { label: "Completed", class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", class: "bg-red-100 text-red-700 border-red-200" },
};

export default function OrdersDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, paid: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, clients(name, email, phone)")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const mapped = (data || []).map((o: any) => ({ ...o, clients: getClient(o.clients) })) as Order[];
    setOrders(mapped);

    const total = mapped.length;
    const paid = mapped.filter((o) => o.status === "paid").length;
    const revenue = mapped.filter((o) => o.status === "paid").reduce((s, o) => s + (o.total_usd || 0), 0);
    const pending = mapped.filter((o) => ["pending", "invoiced", "awaiting_payment", "deposit_paid"].includes(o.status)).length;
    setStats({ total, paid, revenue, pending });
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      const channel = supabase.channel("orders-realtime").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders()).subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate("/");
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingStatus(orderId);
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Updated", description: `Status → ${STATUS_STYLES[status]?.label || status}` });
      fetchOrders();
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status });
    }
    setUpdatingStatus(null);
  };

  const saveAdminNotes = async () => {
    if (!selectedOrder) return;
    const { error } = await supabase.from("orders").update({ admin_notes: adminNotes }).eq("id", selectedOrder.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved", description: "Notes updated" });
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.clients?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.clients?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.services_summary?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-xl font-bold text-primary-foreground mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
            >
              GD
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm mt-1">Guru Designers Orders Dashboard</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-3xl p-6 space-y-4 bg-card border border-border shadow-lg"
          >
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="admin@designers.guru"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {loginError}
              </p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-primary-foreground font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border sticky top-0 z-30 bg-card/95 backdrop-blur-sm">
        <div className="font-display font-bold text-base text-foreground">
          designers<span className="text-primary">.guru</span>
          <span className="ml-3 text-xs text-muted-foreground font-normal">Orders</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchOrders} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.total, icon: Filter, color: "blue" },
            { label: "Paid Orders", value: stats.paid, icon: CheckCircle, color: "green" },
            { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "copper" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "yellow" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 bg-card border border-border shadow-sm"
            >
              <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color === "copper" ? "text-gradient-copper" : "text-foreground"}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5 bg-card border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, invoice..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm text-foreground outline-none bg-card border border-border"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_STYLES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {orders.length === 0 ? "No orders yet — share the chat link to get started!" : "No orders match your search."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {["Invoice", "Client", "Services", "Amount", "Status", "Payment", "Date", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setAdminNotes(order.admin_notes || "");
                      }}
                    >
                      <td className="px-4 py-4 text-sm font-mono text-primary whitespace-nowrap">
                        {order.invoice_number || order.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-foreground">{order.clients?.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{order.clients?.email || "—"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground max-w-[180px] truncate">{order.services_summary || "—"}</p>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground whitespace-nowrap">
                        ${(order.total_usd || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_STYLES[order.status]?.class || ""}`}
                        >
                          {STATUS_STYLES[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground capitalize">
                        {order.payment_method || "—"}
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setAdminNotes(order.admin_notes || "");
                          }}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg z-50 overflow-y-auto bg-card border-l border-border shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Client Info */}
                  <div className="rounded-2xl p-4 bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Client</p>
                    <p className="font-semibold text-foreground">{selectedOrder.clients?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.clients?.email}</p>
                    {selectedOrder.clients?.phone && (
                      <p className="text-sm text-muted-foreground mt-0.5">{selectedOrder.clients.phone}</p>
                    )}
                  </div>

                  {/* Line Items */}
                  <div className="rounded-2xl p-4 bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Services</p>
                    {(selectedOrder.line_items || []).map((item, i) => (
                      <div key={i} className="flex justify-between py-1.5 text-sm">
                        <span className="text-foreground">{item.name}</span>
                        <span className="font-medium text-foreground">${(item.price || 0).toLocaleString()}</span>
                      </div>
                    ))}
                    {selectedOrder.discount_pct > 0 && (
                      <div className="flex justify-between py-1.5 text-sm text-green-600">
                        <span>Discount ({selectedOrder.discount_pct}%)</span>
                        <span>−${(selectedOrder.discount_usd || 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 mt-1 border-t border-border font-bold text-sm">
                      <span>Total</span>
                      <span className="text-gradient-copper">${(selectedOrder.total_usd || 0).toLocaleString()} USD</span>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="rounded-2xl p-4 bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
                      Update Status
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(STATUS_STYLES).map(([status, style]) => (
                        <button
                          key={status}
                          disabled={updatingStatus === selectedOrder.id}
                          onClick={() => updateOrderStatus(selectedOrder.id, status)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-left ${
                            selectedOrder.status === status
                              ? style.class
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {style.label}
                          {updatingStatus === selectedOrder.id && selectedOrder.status === status && (
                            <span className="ml-1">…</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="rounded-2xl p-4 bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
                      Internal Notes
                    </p>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none"
                      placeholder="Add notes about this project..."
                    />
                    <button
                      onClick={saveAdminNotes}
                      className="mt-2 px-4 py-2 rounded-xl text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>

                  {/* Full Conversation Transcript */}
                  {selectedOrder.chat_summary && (
                    <div className="rounded-2xl p-4 bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
                        💬 Full Conversation
                      </p>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {selectedOrder.chat_summary.split("\n\n").filter(Boolean).map((line, i) => {
                          const isUser = line.startsWith("[USER]:");
                          const isAssistant = line.startsWith("[ASSISTANT]:");
                          const text = line.replace(/^\[(USER|ASSISTANT)\]:\s*/, "");
                          return (
                            <div key={i} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                              {isAssistant && (
                                <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold text-primary-foreground flex-shrink-0 mt-0.5"
                                  style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
                              )}
                              <div
                                className={`text-xs leading-relaxed rounded-xl px-3 py-2 max-w-[85%] ${
                                  isUser
                                    ? "bg-primary/10 border border-primary/20 text-foreground"
                                    : "bg-muted border border-border text-foreground"
                                }`}
                              >
                                {text}
                              </div>
                              {isUser && (
                                <div className="w-5 h-5 rounded-lg bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground flex-shrink-0 mt-0.5">C</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
