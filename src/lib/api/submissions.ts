// Submissions API Service
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Submission = Database['public']['Tables']['submissions']['Row'];
type SubmissionInsert = Database['public']['Tables']['submissions']['Insert'];

export interface CreateSubmissionData {
  rubric_id: string;
  filename: string;
  file_path: string;
  file_type: string;
}

/**
 * Get all submissions for the current user
 */
export async function getUserSubmissions() {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      rubrics (
        id,
        name,
        description
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Submission[];
}

/**
 * Get a single submission by ID
 */
export async function getSubmissionById(id: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      rubrics (
        id,
        name,
        description,
        criteria
      ),
      evaluations (
        id,
        overall_score,
        criteria_scores,
        strengths,
        improvements,
        detailed_feedback,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new submission
 */
export async function createSubmission(submissionData: CreateSubmissionData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const insertData: SubmissionInsert = {
    user_id: user.id,
    rubric_id: submissionData.rubric_id,
    filename: submissionData.filename,
    file_path: submissionData.file_path,
    file_type: submissionData.file_type,
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('submissions')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
}

/**
 * Delete a submission
 */
export async function deleteSubmission(id: string) {
  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get submissions by status
 */
export async function getSubmissionsByStatus(status: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Submission[];
}

/**
 * Get recent submissions (last N)
 */
export async function getRecentSubmissions(limit: number = 10) {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      rubrics (
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
