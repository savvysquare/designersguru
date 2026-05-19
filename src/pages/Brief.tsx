import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Loader2, CheckCircle2, ArrowLeft, ImageIcon, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const PROJECT_TYPES = [
  "Website Design & Development",
  "Brand Identity / Logo",
  "Mobile App Design",
  "AI Agent / Chatbot",
  "E-commerce Store",
  "UI/UX Redesign",
  "Marketing Site / Landing Page",
  "Other",
];

const BUDGETS = ["< $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000 – $10,000", "$10,000+", "Not sure yet"];
const TIMELINES = ["2 – 3 weeks", "1 month", "1 – 2 months", "2 – 3 months", "Flexible"];

type UploadCategory = "logo" | "image" | "document";

export default function Brief() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState<UploadCategory | null>(null);

  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    company_name: "",
    project_type: "",
    project_title: "",
    project_description: "",
    target_audience: "",
    goals: "",
    inspiration: "",
    budget_range: "",
    timeline: "",
    has_logo: false,
    wants_logo_design: false,
    brand_colors: "",
    brand_fonts: "",
    brand_notes: "",
    additional_notes: "",
  });

  const [logoUrls, setLogoUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, cat: UploadCategory) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(cat);
    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${cat}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("brief-uploads").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }
      const { data } = supabase.storage.from("brief-uploads").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    if (cat === "logo") setLogoUrls((p) => [...p, ...uploaded]);
    if (cat === "image") setImageUrls((p) => [...p, ...uploaded]);
    if (cat === "document") setDocumentUrls((p) => [...p, ...uploaded]);
    setUploading(null);
    e.target.value = "";
  };

  const removeUrl = (cat: UploadCategory, url: string) => {
    if (cat === "logo") setLogoUrls((p) => p.filter((u) => u !== url));
    if (cat === "image") setImageUrls((p) => p.filter((u) => u !== url));
    if (cat === "document") setDocumentUrls((p) => p.filter((u) => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.client_email || !form.project_type || !form.project_title) {
      toast({ title: "Missing info", description: "Please fill in name, email, project type and title.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("briefs").insert({
      ...form,
      logo_urls: logoUrls,
      image_urls: imageUrls,
      document_urls: documentUrls,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Brief received</h1>
          <p className="text-muted-foreground mb-8">
            Thanks {form.client_name.split(" ")[0]} — we'll review your project and get back to you within 24 hours.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to homepage
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm outline-none focus:border-primary/50 transition-colors";
  const labelCls = "text-xs text-muted-foreground font-semibold block mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 md:px-[60px] py-6 border-b border-border">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Guru Designers
        </Link>
      </div>

      <div className="px-6 md:px-[60px] py-16 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Project Brief
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            Tell us about<br />your project.
          </h1>
          <p className="text-muted-foreground text-lg">
            The more detail you share, the more precise our quote and creative direction will be.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Contact */}
          <Section title="01 — Contact">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full Name *"><input className={inputCls} required value={form.client_name} onChange={(e) => set("client_name", e.target.value)} /></Field>
              <Field label="Company / Brand"><input className={inputCls} value={form.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field>
              <Field label="Email *"><input type="email" className={inputCls} required value={form.client_email} onChange={(e) => set("client_email", e.target.value)} /></Field>
              <Field label="Phone / WhatsApp"><input className={inputCls} value={form.client_phone} onChange={(e) => set("client_phone", e.target.value)} /></Field>
            </div>
          </Section>

          {/* Project */}
          <Section title="02 — Project">
            <Field label="Project Type *">
              <select required className={inputCls} value={form.project_type} onChange={(e) => set("project_type", e.target.value)}>
                <option value="">Select a project type…</option>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Project Title *"><input className={inputCls} required placeholder="e.g. New marketing website for Acme" value={form.project_title} onChange={(e) => set("project_title", e.target.value)} /></Field>
            <Field label="Project Description"><textarea rows={5} className={inputCls} placeholder="What are you building? What problem does it solve?" value={form.project_description} onChange={(e) => set("project_description", e.target.value)} /></Field>
            <Field label="Target Audience"><textarea rows={2} className={inputCls} placeholder="Who is this for?" value={form.target_audience} onChange={(e) => set("target_audience", e.target.value)} /></Field>
            <Field label="Goals & Success Metrics"><textarea rows={3} className={inputCls} placeholder="What does success look like?" value={form.goals} onChange={(e) => set("goals", e.target.value)} /></Field>
            <Field label="Inspiration / References"><textarea rows={3} className={inputCls} placeholder="Links to sites, brands or work you love" value={form.inspiration} onChange={(e) => set("inspiration", e.target.value)} /></Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Budget Range">
                <select className={inputCls} value={form.budget_range} onChange={(e) => set("budget_range", e.target.value)}>
                  <option value="">Select…</option>
                  {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Desired Timeline">
                <select className={inputCls} value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                  <option value="">Select…</option>
                  {TIMELINES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          {/* Branding */}
          <Section title="03 — Branding & Logo">
            <div className="grid md:grid-cols-2 gap-4">
              <Toggle label="I already have a logo" checked={form.has_logo} onChange={(v) => set("has_logo", v)} />
              <Toggle label="I want you to design a logo" checked={form.wants_logo_design} onChange={(v) => set("wants_logo_design", v)} />
            </div>
            {form.has_logo && (
              <UploadField label="Upload your logo files" hint="SVG, PNG, AI, PDF" cat="logo" urls={logoUrls} uploading={uploading} onUpload={handleUpload} onRemove={removeUrl} />
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Brand Colors"><input className={inputCls} placeholder="e.g. #FF6B35, navy blue" value={form.brand_colors} onChange={(e) => set("brand_colors", e.target.value)} /></Field>
              <Field label="Preferred Fonts"><input className={inputCls} placeholder="e.g. Inter, Playfair" value={form.brand_fonts} onChange={(e) => set("brand_fonts", e.target.value)} /></Field>
            </div>
            <Field label="Brand Notes / Tone"><textarea rows={2} className={inputCls} placeholder="Playful? Editorial? Luxurious? Anything we should know about your brand voice." value={form.brand_notes} onChange={(e) => set("brand_notes", e.target.value)} /></Field>
          </Section>

          {/* Assets */}
          <Section title="04 — Assets & Documents">
            <UploadField label="Photos / Images to use" hint="JPG, PNG, WEBP" cat="image" urls={imageUrls} uploading={uploading} onUpload={handleUpload} onRemove={removeUrl} />
            <UploadField label="Brief documents, copy, decks" hint="PDF, DOC, TXT, etc." cat="document" urls={documentUrls} uploading={uploading} onUpload={handleUpload} onRemove={removeUrl} />
          </Section>

          <Section title="05 — Anything Else">
            <Field label="Additional Notes"><textarea rows={4} className={inputCls} placeholder="Anything else we should know?" value={form.additional_notes} onChange={(e) => set("additional_notes", e.target.value)} /></Field>
          </Section>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-primary-foreground font-semibold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, hsl(25 85% 55%), hsl(35 100% 70%))" }}
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit Brief"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-primary">{title}</h2>
      <div className="space-y-4 rounded-3xl p-6 bg-card border border-border shadow-sm">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-semibold block mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors ${checked ? "bg-primary/10 border-primary/40 text-foreground" : "bg-background border-border text-muted-foreground"}`}
    >
      {label}
      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checked ? "bg-primary border-primary" : "border-border"}`}>
        {checked && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
      </div>
    </button>
  );
}

function UploadField({
  label, hint, cat, urls, uploading, onUpload, onRemove,
}: {
  label: string; hint: string; cat: UploadCategory; urls: string[];
  uploading: UploadCategory | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, cat: UploadCategory) => void;
  onRemove: (cat: UploadCategory, url: string) => void;
}) {
  const Icon = cat === "document" ? FileText : ImageIcon;
  return (
    <div>
      <label className="text-xs text-muted-foreground font-semibold block mb-1.5 uppercase tracking-wide">{label}</label>
      <label className="block cursor-pointer">
        <input type="file" multiple className="hidden" onChange={(e) => onUpload(e, cat)} accept={cat === "document" ? ".pdf,.doc,.docx,.txt,.ppt,.pptx" : "image/*"} />
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
          {uploading === cat ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium">Click to upload</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        </div>
      </label>
      {urls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
          {urls.map((url) => (
            <div key={url} className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-square">
              {cat === "document" ? (
                <a href={url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center h-full p-2 text-center">
                  <Icon className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground truncate w-full">{url.split("/").pop()}</span>
                </a>
              ) : (
                <a href={url} target="_blank" rel="noreferrer"><img src={url} alt="upload" className="w-full h-full object-cover" /></a>
              )}
              <button type="button" onClick={() => onRemove(cat, url)} className="absolute top-1 right-1 p-1 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
