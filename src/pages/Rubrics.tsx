import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRubrics, useDeleteRubric } from "@/hooks/useRubrics";
import { seedDefaultRubrics } from "@/lib/api/rubrics";
import { useState } from "react";

export default function Rubrics() {
  const { data: rubrics, isLoading, error } = useRubrics();
  const deleteRubric = useDeleteRubric();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleCreateRubric = () => {
    toast.success("Rubric creation interface will open");
  };

  const handleEditRubric = (id: string) => {
    toast.info(`Editing rubric ${id}`);
  };

  const handleDeleteRubric = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
      deleteRubric.mutate(id);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedDefaultRubrics();
      toast.success("Default rubrics created successfully!");
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to seed rubrics';
      toast.error(message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Evaluation Rubrics
              </h1>
              <p className="text-lg text-muted-foreground">
                Create and manage custom evaluation criteria for your assessments
              </p>
            </div>
            <Button variant="hero" onClick={handleCreateRubric} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Rubric
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-destructive">Failed to load rubrics. Please try again.</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && rubrics && rubrics.length === 0 && (
            <Card className="border-border shadow-md">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No rubrics found. Create your first rubric or load default templates.</p>
                <Button onClick={handleSeedData} disabled={isSeeding} className="gap-2">
                  {isSeeding && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSeeding ? 'Loading...' : 'Load Default Rubrics'}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {rubrics?.map((rubric) => {
              const criteria = Array.isArray(rubric.criteria) ? rubric.criteria : [];
              return (
                <Card key={rubric.id} className="border-border shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-2">{rubric.name}</CardTitle>
                        <CardDescription>{rubric.description || 'No description'}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditRubric(rubric.id)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        {!rubric.is_default && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteRubric(rubric.id, rubric.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Evaluation Criteria</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {criteria.map((criterion: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-secondary rounded-lg p-3"
                          >
                            <span className="text-sm font-medium text-secondary-foreground">
                              {criterion.name || 'Unnamed'}
                            </span>
                            <Badge variant="outline">{criterion.weight || 0}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="text-lg font-semibold text-foreground">
                            {new Date(rubric.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {rubric.is_default && (
                          <Badge variant="secondary">Default Template</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
