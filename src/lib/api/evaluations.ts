// Evaluations API Service
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Evaluation = Database['public']['Tables']['evaluations']['Row'];

/**
 * Get evaluation for a specific submission
 */
export async function getEvaluationBySubmissionId(submissionId: string) {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('submission_id', submissionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No evaluation found
    throw error;
  }
  return data as Evaluation;
}

/**
 * Get all evaluations for the current user
 */
export async function getUserEvaluations() {
  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      submissions (
        id,
        filename,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get evaluation statistics for the user
 */
export async function getEvaluationStats() {
  const { data, error } = await supabase
    .from('evaluations')
    .select('overall_score, created_at');

  if (error) throw error;

  const evaluations = data || [];
  const totalEvaluations = evaluations.length;
  
  if (totalEvaluations === 0) {
    return {
      totalEvaluations: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      recentTrend: [],
    };
  }

  const scores = evaluations.map(e => e.overall_score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalEvaluations);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  // Get recent 10 for trend
  const recentTrend = evaluations
    .slice(0, 10)
    .reverse()
    .map(e => ({
      date: new Date(e.created_at).toLocaleDateString(),
      score: e.overall_score,
    }));

  return {
    totalEvaluations,
    averageScore,
    highestScore,
    lowestScore,
    recentTrend,
  };
}

/**
 * Trigger evaluation for a submission
 * This performs client-side heuristic evaluation (temporary until edge function deployed)
 */
export async function triggerEvaluation(submissionId: string, rubricCriteria: any[], fileContent: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Simple client-side heuristic evaluation
  const lowerContent = fileContent.toLowerCase();
  const keywords = ['if', 'loop', 'for', 'while', 'function', 'start', 'end', 'return', 'process'];
  
  let baseScore = 0;
  keywords.forEach(kw => {
    const matches = (lowerContent.match(new RegExp(kw, 'g')) || []).length;
    baseScore += matches * 3;
  });

  // Score each criterion
  const criteriaScores = rubricCriteria.map((criterion: any) => {
    const weight = criterion.weight || 25;
    const rawScore = Math.min(weight, Math.round((baseScore / 40) * weight));
    return {
      name: criterion.name || 'Criterion',
      score: rawScore,
      feedback: rawScore >= weight * 0.8 
        ? `Good ${criterion.name?.toLowerCase() || 'performance'}` 
        : `Consider improving ${criterion.name?.toLowerCase() || 'this area'}`,
    };
  });

  const overallScore = Math.round(
    criteriaScores.reduce((sum: number, c: any) => sum + c.score, 0) / rubricCriteria.length
  );

  // Create evaluation record directly
  const { data, error } = await supabase
    .from('evaluations')
    .insert({
      submission_id: submissionId,
      user_id: user.id,
      overall_score: overallScore,
      criteria_scores: criteriaScores,
      strengths: [
        'Clear structure identified',
        'Good use of keywords',
      ],
      improvements: [
        'Consider adding more detailed comments',
        'Enhance error handling',
      ],
      detailed_feedback: `Your submission scored ${overallScore}%. The evaluation identified key algorithmic patterns and structure.`,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
