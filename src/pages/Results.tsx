import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Info, Download, Home, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSubmission } from "@/hooks/useSubmissions";
import { useEvaluation } from "@/hooks/useEvaluations";

export default function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('id') || '';
  
  const { data: submission, isLoading: submissionLoading } = useSubmission(submissionId);
  const { data: evaluation, isLoading: evaluationLoading } = useEvaluation(submissionId);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const isLoading = submissionLoading || evaluationLoading;
  const criteriaScores = evaluation?.criteria_scores as any[] || [];
  const strengths = Array.isArray(evaluation?.strengths) ? evaluation.strengths : [];
  const improvements = Array.isArray(evaluation?.improvements) ? evaluation.improvements : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </Button>
          </div>

          {isLoading && (
            <Card className="border-border shadow-lg">
              <CardContent className="py-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg text-foreground">Evaluating your submission...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !evaluation && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="py-12 text-center">
                <p className="text-destructive mb-4">No evaluation found for this submission.</p>
                <Button onClick={() => navigate("/upload")}>Upload Another</Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && evaluation && submission && (
            <>
              <Card className="border-border shadow-lg mb-6">
                <CardHeader className="bg-gradient-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">Evaluation Results</CardTitle>
                      <CardDescription>
                        File: {submission.filename} • Rubric: {submission.rubrics?.name || 'Unknown'}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-5xl font-bold ${getScoreColor(evaluation.overall_score)}`}>
                        {evaluation.overall_score}
                      </div>
                      <div className="text-sm text-muted-foreground">Overall Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Progress value={evaluation.overall_score} className="h-3" />
                </CardContent>
              </Card>

              <div className="grid gap-6 mb-6">
                <Card className="border-border shadow-md">
                  <CardHeader>
                    <CardTitle>Detailed Criteria Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {criteriaScores.map((criterion: any, index: number) => {
                        const percentage = criterion.score || 0;
                        return (
                          <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {percentage >= 80 ? (
                                  <CheckCircle className="w-5 h-5 text-success" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-warning" />
                                )}
                                <div>
                                  <h4 className="font-semibold text-foreground">{criterion.name || 'Criterion'}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Score: {percentage}/100
                                  </p>
                                </div>
                              </div>
                              <Badge variant={percentage >= 80 ? "default" : "secondary"}>
                                {percentage}%
                              </Badge>
                            </div>
                            <Progress value={percentage} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {criterion.feedback || 'No feedback available'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-border shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {strengths.length > 0 ? (
                        <ul className="space-y-2">
                          {strengths.map((strength: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                              <span className="text-success mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No specific strengths identified</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-border shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-warning" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {improvements.length > 0 ? (
                        <ul className="space-y-2">
                          {improvements.map((improvement: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                              <span className="text-warning mt-1">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No specific improvements suggested</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {evaluation.detailed_feedback && (
                  <Card className="border-border shadow-md">
                    <CardHeader>
                      <CardTitle>Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {evaluation.detailed_feedback}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex gap-4">
                <Button variant="hero" className="flex-1" onClick={() => navigate("/upload")}>
                  Evaluate Another Submission
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
