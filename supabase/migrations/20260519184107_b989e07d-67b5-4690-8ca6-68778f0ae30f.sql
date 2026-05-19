-- Briefs table
CREATE TABLE public.briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  company_name TEXT,
  -- Project
  project_type TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT,
  target_audience TEXT,
  goals TEXT,
  inspiration TEXT,
  budget_range TEXT,
  timeline TEXT,
  -- Branding
  has_logo BOOLEAN DEFAULT false,
  wants_logo_design BOOLEAN DEFAULT false,
  brand_colors TEXT,
  brand_fonts TEXT,
  brand_notes TEXT,
  -- Files
  logo_urls JSONB DEFAULT '[]'::jsonb,
  image_urls JSONB DEFAULT '[]'::jsonb,
  document_urls JSONB DEFAULT '[]'::jsonb,
  -- Extra
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a brief"
  ON public.briefs FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can manage briefs"
  ON public.briefs FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE TRIGGER update_briefs_updated_at
  BEFORE UPDATE ON public.briefs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brief-uploads', 'brief-uploads', true);

CREATE POLICY "Brief uploads publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brief-uploads');

CREATE POLICY "Anyone can upload brief files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brief-uploads');

CREATE POLICY "Admins can manage brief uploads"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'brief-uploads' AND is_admin())
  WITH CHECK (bucket_id = 'brief-uploads' AND is_admin());