import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecentSubmissions } from "@/hooks/useSubmissions";
import { useEvaluationStats } from "@/hooks/useEvaluations";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: submissions, isLoading: submissionsLoading } = useRecentSubmissions(10);
  const { data: stats, isLoading: statsLoading } = useEvaluationStats();

  const isLoading = submissionsLoading || statsLoading;

  const statsCards = [
    {
      title: "Total Evaluations",
      value: stats?.totalEvaluations.toString() || "0",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Average Score",
      value: `${stats?.averageScore || 0}%`,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Highest Score",
      value: stats?.highestScore.toString() || "0",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Lowest Score",
      value: stats?.lowestScore.toString() || "0",
      icon: Clock,
      color: "text-warning",
    },
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-success text-success-foreground">{score}</Badge>;
    if (score >= 60) return <Badge className="bg-warning text-warning-foreground">{score}</Badge>;
    return <Badge className="bg-destructive text-destructive-foreground">{score}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Evaluation Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Track and manage all your submissions and results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="border-border shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`bg-gradient-primary rounded-lg w-12 h-12 flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>View and manage your evaluation history</CardDescription>
                </div>
                <Button variant="hero" onClick={() => navigate("/upload")}>
                  New Evaluation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && submissions && submissions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No submissions yet</p>
                  <Button onClick={() => navigate("/upload")}>Upload Your First Submission</Button>
                </div>
              )}

              <div className="space-y-4">
                {submissions?.map((submission: any) => {
                  const evaluation = submission.evaluations?.[0];
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        if (evaluation) {
                          navigate(`/results?id=${submission.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-primary rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{submission.filename}</h4>
                          <p className="text-sm text-muted-foreground">{submission.rubrics?.name || 'Unknown rubric'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                          {evaluation ? (
                            getScoreBadge(evaluation.overall_score)
                          ) : (
                            <Badge variant="secondary">{submission.status}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
