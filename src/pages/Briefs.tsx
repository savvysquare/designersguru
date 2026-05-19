import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, LogOut, Loader2, X, Eye, FileText, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface Brief {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  company_name: string | null;
  project_type: string;
  project_title: string;
  project_description: string | null;
  target_audience: string | null;
  goals: string | null;
  inspiration: string | null;
  budget_range: string | null;
  timeline: string | null;
  has_logo: boolean;
  wants_logo_design: boolean;
  brand_colors: string | null;
  brand_fonts: string | null;
  brand_notes: string | null;
  logo_urls: string[];
  image_urls: string[];
  document_urls: string[];
  additional_notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUS_STYLES: Record<string, { label: string; class: string }> = {
  new: { label: "New", class: "bg-blue-100 text-blue-700 border-blue-200" },
  reviewing: { label: "Reviewing", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  quoted: { label: "Quoted", class: "bg-purple-100 text-purple-700 border-purple-200" },
  accepted: { label: "Accepted", class: "bg-green-100 text-green-700 border-green-200" },
  archived: { label: "Archived", class: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default function Briefs() {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Brief | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const fetchBriefs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("briefs").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setBriefs((data || []) as Brief[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBriefs();
      const ch = supabase.channel("briefs-realtime").on("postgres_changes", { event: "*", schema: "public", table: "briefs" }, () => fetchBriefs()).subscribe();
      return () => { supabase.removeChannel(ch); };
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

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("briefs").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Updated", description: `Status → ${STATUS_STYLES[status]?.label || status}` });
      if (selected?.id === id) setSelected({ ...selected, status });
      fetchBriefs();
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    const { error } = await supabase.from("briefs").update({ admin_notes: adminNotes }).eq("id", selected.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved", description: "Notes updated" });
  };

  const filtered = briefs.filter((b) => {
    const ms = !search || [b.client_name, b.client_email, b.project_title, b.company_name, b.project_type].some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    const mst = statusFilter === "all" || b.status === statusFilter;
    return ms && mst;
  });

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4 shadow-xl shadow-primary/20" style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>G</div>
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm mt-1">Client Briefs</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-3xl p-6 space-y-4 bg-card border border-border shadow-lg">
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm outline-none focus:border-primary/50" placeholder="admin@designers.guru" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm outline-none focus:border-primary/50" placeholder="••••••••" />
            </div>
            {loginError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{loginError}</p>}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loginLoading} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-primary-foreground font-semibold text-sm" style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}>
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border sticky top-0 z-30 bg-card/95 backdrop-blur-sm">
        <div className="font-display font-bold text-base text-foreground tracking-tight">
          Guru <span className="text-primary">Designers</span>
          <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Client Briefs</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/orders" className="text-xs text-muted-foreground hover:text-foreground">Orders →</Link>
          <button onClick={fetchBriefs} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
          <button onClick={handleLogout} title="Sign Out" className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5 bg-card border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, project…" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm text-foreground outline-none bg-card border border-border">
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{briefs.length === 0 ? "No briefs yet — share /brief to collect them." : "No briefs match your search."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {["Project", "Client", "Type", "Budget", "Timeline", "Status", "Date", ""].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, idx) => (
                    <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => { setSelected(b); setAdminNotes(b.admin_notes || ""); }}>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-foreground max-w-[220px] truncate">{b.project_title}</p>
                        <p className="text-xs text-muted-foreground">{b.company_name || "—"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground">{b.client_name}</p>
                        <p className="text-xs text-muted-foreground">{b.client_email}</p>
                      </td>
                      <td className="px-4 py-4 text-xs text-foreground">{b.project_type}</td>
                      <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{b.budget_range || "—"}</td>
                      <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{b.timeline || "—"}</td>
                      <td className="px-4 py-4"><span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_STYLES[b.status]?.class || ""}`}>{STATUS_STYLES[b.status]?.label || b.status}</span></td>
                      <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{new Date(b.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                      <td className="px-4 py-4"><Eye className="w-4 h-4 text-muted-foreground" /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed right-0 top-0 h-full w-full max-w-2xl z-50 overflow-y-auto bg-card border-l border-border shadow-2xl">
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-bold text-foreground">Brief Details</h2>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{selected.project_title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{selected.project_type}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {Object.keys(STATUS_STYLES).map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${selected.status === s ? STATUS_STYLES[s].class : "bg-background text-muted-foreground border-border hover:border-primary/40"}`}>
                      {STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>

                <Block title="Contact">
                  <KV k="Name" v={selected.client_name} />
                  <KV k="Email" v={<a href={`mailto:${selected.client_email}`} className="text-primary hover:underline">{selected.client_email}</a>} />
                  <KV k="Phone" v={selected.client_phone || "—"} />
                  <KV k="Company" v={selected.company_name || "—"} />
                </Block>

                <Block title="Project">
                  <KV k="Description" v={selected.project_description || "—"} />
                  <KV k="Target Audience" v={selected.target_audience || "—"} />
                  <KV k="Goals" v={selected.goals || "—"} />
                  <KV k="Inspiration" v={selected.inspiration || "—"} />
                  <KV k="Budget" v={selected.budget_range || "—"} />
                  <KV k="Timeline" v={selected.timeline || "—"} />
                </Block>

                <Block title="Branding">
                  <KV k="Has Logo" v={selected.has_logo ? "Yes" : "No"} />
                  <KV k="Wants Logo Design" v={selected.wants_logo_design ? "Yes" : "No"} />
                  <KV k="Colors" v={selected.brand_colors || "—"} />
                  <KV k="Fonts" v={selected.brand_fonts || "—"} />
                  <KV k="Brand Notes" v={selected.brand_notes || "—"} />
                </Block>

                {selected.logo_urls?.length > 0 && <FileBlock title="Logo Files" urls={selected.logo_urls} />}
                {selected.image_urls?.length > 0 && <FileBlock title="Images" urls={selected.image_urls} />}
                {selected.document_urls?.length > 0 && <FileBlock title="Documents" urls={selected.document_urls} isDoc />}

                {selected.additional_notes && (
                  <Block title="Additional Notes"><p className="text-sm text-foreground whitespace-pre-wrap">{selected.additional_notes}</p></Block>
                )}

                <Block title="Admin Notes">
                  <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground outline-none focus:border-primary/50" placeholder="Internal notes…" />
                  <button onClick={saveNotes} className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Save Notes</button>
                </Block>

                <p className="text-xs text-muted-foreground">Submitted {new Date(selected.created_at).toLocaleString()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{title}</h3>
      {children}
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm py-1">
      <span className="text-muted-foreground">{k}</span>
      <span className="col-span-2 text-foreground whitespace-pre-wrap break-words">{v}</span>
    </div>
  );
}

function FileBlock({ title, urls, isDoc }: { title: string; urls: string[]; isDoc?: boolean }) {
  return (
    <Block title={title}>
      <div className="grid grid-cols-3 gap-2">
        {urls.map((url) => (
          <a key={url} href={url} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden border border-border bg-muted relative group">
            {isDoc ? (
              <div className="flex flex-col items-center justify-center h-full p-2 text-center">
                <FileText className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-[10px] text-muted-foreground truncate w-full">{url.split("/").pop()}</span>
              </div>
            ) : (
              <img src={url} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
          </a>
        ))}
      </div>
    </Block>
  );
}
