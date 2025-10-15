-- Quick fix: Add missing INSERT policy for evaluations
-- Run this in Supabase SQL Editor

-- First, drop the policy if it exists (in case it's malformed)
DROP POLICY IF EXISTS "Users can create their own evaluations" ON public.evaluations;

-- Now create it fresh
CREATE POLICY "Users can create their own evaluations"
  ON public.evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Verify all policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'evaluations';

-- Should show:
-- 1. "Users can view their own evaluations" (SELECT)
-- 2. "Users can create their own evaluations" (INSERT)
