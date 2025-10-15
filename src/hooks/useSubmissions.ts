// React Query hooks for Submissions
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  getRecentSubmissions,
  type CreateSubmissionData,
} from '@/lib/api/submissions';
import { uploadFile, downloadFileContent } from '@/lib/storage';
import { triggerEvaluation } from '@/lib/api/evaluations';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch all user submissions
 */
export function useSubmissions() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: getUserSubmissions,
  });
}

/**
 * Hook to fetch a single submission with evaluation
 */
export function useSubmission(id: string) {
  return useQuery({
    queryKey: ['submissions', id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch recent submissions
 */
export function useRecentSubmissions(limit?: number) {
  return useQuery({
    queryKey: ['submissions', 'recent', limit],
    queryFn: () => getRecentSubmissions(limit),
  });
}

/**
 * Hook to upload a file and create submission
 */
export function useUploadSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      rubricId,
      userId,
      rubricCriteria,
    }: {
      file: File;
      rubricId: string;
      userId: string;
      rubricCriteria: any[];
    }) => {
      // 1. Upload file to storage
      const filePath = await uploadFile(file, userId);

      // 2. Create submission record
      const submission = await createSubmission({
        rubric_id: rubricId,
        filename: file.name,
        file_path: filePath,
        file_type: file.type,
      });

      // 3. Download file content for evaluation
      const fileContent = await downloadFileContent(filePath);

      // 4. Trigger evaluation
      await triggerEvaluation(submission.id, rubricCriteria, fileContent);

      // 5. Update status
      await updateSubmissionStatus(submission.id, 'completed');

      return submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({
        title: 'Submission uploaded',
        description: 'Your file has been uploaded and evaluation is in progress.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a submission
 */
export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({
        title: 'Submission deleted',
        description: 'Your submission has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting submission',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
