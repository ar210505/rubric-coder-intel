// React Query hooks for Rubrics
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserRubrics,
  getRubricById,
  createRubric,
  updateRubric,
  deleteRubric,
  getDefaultRubrics,
  type CreateRubricData,
} from '@/lib/api/rubrics';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch all user rubrics
 */
export function useRubrics() {
  return useQuery({
    queryKey: ['rubrics'],
    queryFn: getUserRubrics,
  });
}

/**
 * Hook to fetch a single rubric
 */
export function useRubric(id: string) {
  return useQuery({
    queryKey: ['rubrics', id],
    queryFn: () => getRubricById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch default rubrics
 */
export function useDefaultRubrics() {
  return useQuery({
    queryKey: ['rubrics', 'defaults'],
    queryFn: getDefaultRubrics,
  });
}

/**
 * Hook to create a new rubric
 */
export function useCreateRubric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRubric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubrics'] });
      toast({
        title: 'Rubric created',
        description: 'Your rubric has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating rubric',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a rubric
 */
export function useUpdateRubric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateRubricData> }) =>
      updateRubric(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rubrics'] });
      queryClient.invalidateQueries({ queryKey: ['rubrics', variables.id] });
      toast({
        title: 'Rubric updated',
        description: 'Your rubric has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating rubric',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a rubric
 */
export function useDeleteRubric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRubric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubrics'] });
      toast({
        title: 'Rubric deleted',
        description: 'Your rubric has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting rubric',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
