import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as {
      submissionId?: string;
      rubricCriteria?: Array<{ weight?: number } | Record<string, unknown>>;
      fileContent?: string;
    };
    const submissionId = body.submissionId;
    const rubricCriteria = body.rubricCriteria ?? [];
    const fileContent = body.fileContent ?? "";
    console.log('Evaluating submission:', submissionId);


    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Local heuristic evaluation (no external AI).
    // Simple scoring approach: for each criterion weight, generate a pseudo score
    // based on presence of keywords in the content (very naive placeholder logic).
    const lowerContent = fileContent.toLowerCase();
    const keywordBuckets = [
      { key: 'if', boost: 4 },
      { key: 'loop', boost: 5 },
      { key: 'for', boost: 5 },
      { key: 'while', boost: 5 },
      { key: 'function', boost: 6 },
      { key: 'start', boost: 3 },
      { key: 'end', boost: 3 },
      { key: 'return', boost: 4 },
      { key: 'process', boost: 2 },
    ];

    const criteria_scores: Record<string, number> = {};
    const strengths: string[] = [];
    const improvements: string[] = [];

  type Criterion = { name?: string; weight?: number } & Record<string, unknown>;
  (rubricCriteria as Criterion[]).forEach((c) => {
      const weight = typeof c?.weight === 'number' ? c.weight : 10;
      const name = typeof c?.name === 'string' ? c.name : 'Criterion';
      let base = 0;
      keywordBuckets.forEach(k => {
        if (lowerContent.includes(k.key)) base += k.boost;
      });
      // Normalize and clamp to weight
      const rawScore = Math.min(weight, Math.round((base / 40) * weight));
      criteria_scores[name] = rawScore;
      if (rawScore / weight > 0.7) strengths.push(`${name}: solid presence`);
      else improvements.push(`${name}: could be expanded with clearer structure or detail`);
    });

    const evaluation = {
      criteria_scores,
      strengths: strengths.slice(0, 5),
      improvements: improvements.slice(0, 5),
      detailed_feedback: 'This heuristic evaluation provides rough guidance only. Refine your submission focusing on clarity, structure, and completeness of logical steps.'
    };

    // Calculate overall score
  const totalScore = Object.values(evaluation.criteria_scores).reduce((a, b) => a + Number(b), 0);
    const maxScore = Array.isArray(rubricCriteria)
      ? rubricCriteria.reduce((sum: number, c) => {
          let w = 0;
          if (c && typeof c === 'object' && 'weight' in c) {
            const maybe = c as Record<string, unknown>;
            const val = maybe['weight'];
            if (typeof val === 'number' || typeof val === 'string') {
              w = Number(val);
            }
          }
          return sum + w;
        }, 0)
      : 0;
    const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Save evaluation to database
    const { error: insertError } = await supabase
      .from('evaluations')
      .insert({
        submission_id: submissionId,
        user_id: user.id,
        overall_score: overallScore,
        criteria_scores: evaluation.criteria_scores,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        detailed_feedback: evaluation.detailed_feedback,
      });

    if (insertError) {
      console.error('Failed to save evaluation:', insertError);
      throw insertError;
    }

    // Update submission status
    await supabase
      .from('submissions')
      .update({ status: 'completed' })
      .eq('id', submissionId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        overallScore,
        evaluation 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Evaluation error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
