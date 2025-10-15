-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create rubrics table
CREATE TABLE public.rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on rubrics
ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;

-- Rubrics policies
CREATE POLICY "Users can view their own rubrics"
  ON public.rubrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rubrics"
  ON public.rubrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rubrics"
  ON public.rubrics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rubrics"
  ON public.rubrics FOR DELETE
  USING (auth.uid() = user_id);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rubric_id UUID NOT NULL REFERENCES public.rubrics(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Submissions policies
CREATE POLICY "Users can view their own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions"
  ON public.submissions FOR DELETE
  USING (auth.uid() = user_id);

-- Create evaluations table
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL,
  criteria_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  improvements TEXT[] DEFAULT ARRAY[]::TEXT[],
  detailed_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on evaluations
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Evaluations policies
CREATE POLICY "Users can view their own evaluations"
  ON public.evaluations FOR SELECT
  USING (auth.uid() = user_id);

-- Create storage bucket for submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for submissions bucket
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_rubrics_updated_at
  BEFORE UPDATE ON public.rubrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
