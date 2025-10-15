-- Comprehensive fix for evaluations RLS policy
-- This ensures the policy works correctly

-- Step 1: Completely remove all existing policies on evaluations
DROP POLICY IF EXISTS "Users can view their own evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Users can create their own evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Users can insert their own evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Service role can insert evaluations" ON public.evaluations;

-- Step 2: Recreate SELECT policy
CREATE POLICY "Users can view their own evaluations"
  ON public.evaluations FOR SELECT
  USING (auth.uid() = user_id);

-- Step 3: Recreate INSERT policy with explicit check
CREATE POLICY "Users can create evaluations"
  ON public.evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 4: Also allow service role to insert (for edge functions)
CREATE POLICY "Service role can manage all evaluations"
  ON public.evaluations FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Step 5: Verify RLS is enabled
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Step 6: Check current policies
SELECT 
  tablename, 
  policyname, 
  permissive,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'evaluations'
ORDER BY policyname;

-- Expected output: 3 policies
-- 1. Service role can manage all evaluations (ALL)
-- 2. Users can create evaluations (INSERT)  
-- 3. Users can view their own evaluations (SELECT)
