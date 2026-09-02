CREATE TABLE public.reel_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_key TEXT NOT NULL,
  user_id UUID,
  file_name TEXT NOT NULL,
  video_path TEXT,
  video_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  account_data JSONB,
  previous_performance JSONB,
  result JSONB NOT NULL,
  provider TEXT NOT NULL DEFAULT 'claude',
  model TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.reel_analyses TO service_role;

ALTER TABLE public.reel_analyses ENABLE ROW LEVEL SECURITY;

CREATE INDEX reel_analyses_owner_key_created_at_idx ON public.reel_analyses (owner_key, created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_reel_analyses_updated_at
BEFORE UPDATE ON public.reel_analyses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();