// Rubrics API Service
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Rubric = Database['public']['Tables']['rubrics']['Row'];
type RubricInsert = Database['public']['Tables']['rubrics']['Insert'];
type RubricUpdate = Database['public']['Tables']['rubrics']['Update'];

export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;
  maxScore?: number;
}

export interface CreateRubricData {
  name: string;
  description?: string;
  criteria: RubricCriterion[];
  is_default?: boolean;
}

/**
 * Fetch all rubrics for the current user
 */
export async function getUserRubrics() {
  const { data, error } = await supabase
    .from('rubrics')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Rubric[];
}

/**
 * Fetch a single rubric by ID
 */
export async function getRubricById(id: string) {
  const { data, error } = await supabase
    .from('rubrics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Rubric;
}

/**
 * Create a new rubric
 */
export async function createRubric(rubricData: CreateRubricData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const insertData: RubricInsert = {
    user_id: user.id,
    name: rubricData.name,
    description: rubricData.description,
    criteria: rubricData.criteria as any, // JSONB type
    is_default: rubricData.is_default || false,
  };

  const { data, error } = await supabase
    .from('rubrics')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return data as Rubric;
}

/**
 * Update an existing rubric
 */
export async function updateRubric(id: string, updates: Partial<CreateRubricData>) {
  const updateData: RubricUpdate = {};
  
  if (updates.name) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.criteria) updateData.criteria = updates.criteria as any;
  if (updates.is_default !== undefined) updateData.is_default = updates.is_default;

  const { data, error } = await supabase
    .from('rubrics')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Rubric;
}

/**
 * Delete a rubric
 */
export async function deleteRubric(id: string) {
  const { error } = await supabase
    .from('rubrics')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get default rubrics
 */
export async function getDefaultRubrics() {
  const { data, error } = await supabase
    .from('rubrics')
    .select('*')
    .eq('is_default', true)
    .order('name');

  if (error) throw error;
  return data as Rubric[];
}

/**
 * Seed default rubrics for a new user
 */
export async function seedDefaultRubrics() {
  const defaultRubrics: CreateRubricData[] = [
    {
      name: 'Flowchart Fundamentals',
      description: 'Evaluate basic flowchart structure, logic flow, and symbol usage',
      is_default: true,
      criteria: [
        { name: 'Logical Flow', description: 'Sequential and logical progression', weight: 30 },
        { name: 'Symbol Usage', description: 'Correct flowchart symbols', weight: 25 },
        { name: 'Completeness', description: 'All paths and edge cases covered', weight: 25 },
        { name: 'Documentation', description: 'Clear labels and annotations', weight: 20 },
      ],
    },
    {
      name: 'Algorithm Analysis',
      description: 'Assess algorithm efficiency, correctness, and implementation quality',
      is_default: true,
      criteria: [
        { name: 'Time Complexity', description: 'Efficiency analysis', weight: 35 },
        { name: 'Space Complexity', description: 'Memory usage', weight: 25 },
        { name: 'Correctness', description: 'Logic accuracy', weight: 30 },
        { name: 'Code Quality', description: 'Readability and style', weight: 10 },
      ],
    },
    {
      name: 'Pseudocode Standards',
      description: 'Evaluate pseudocode syntax, readability, and logic clarity',
      is_default: true,
      criteria: [
        { name: 'Syntax Adherence', description: 'Proper pseudocode conventions', weight: 25 },
        { name: 'Logic Clarity', description: 'Clear algorithmic logic', weight: 35 },
        { name: 'Readability', description: 'Easy to understand', weight: 20 },
        { name: 'Structure', description: 'Well-organized', weight: 20 },
      ],
    },
  ];

  const promises = defaultRubrics.map(rubric => createRubric(rubric));
  return Promise.all(promises);
}
