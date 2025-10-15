// React Query hooks for Evaluations
import { useQuery } from '@tanstack/react-query';
import {
  getEvaluationBySubmissionId,
  getUserEvaluations,
  getEvaluationStats,
} from '@/lib/api/evaluations';

/**
 * Hook to fetch evaluation for a specific submission
 */
export function useEvaluation(submissionId: string) {
  return useQuery({
    queryKey: ['evaluations', 'submission', submissionId],
    queryFn: () => getEvaluationBySubmissionId(submissionId),
    enabled: !!submissionId,
    refetchInterval: (query) => {
      // Poll every 3 seconds if no data yet (evaluation in progress)
      return query.state.data ? false : 3000;
    },
  });
}

/**
 * Hook to fetch all user evaluations
 */
export function useEvaluations() {
  return useQuery({
    queryKey: ['evaluations'],
    queryFn: getUserEvaluations,
  });
}

/**
 * Hook to fetch evaluation statistics
 */
export function useEvaluationStats() {
  return useQuery({
    queryKey: ['evaluations', 'stats'],
    queryFn: getEvaluationStats,
  });
}
