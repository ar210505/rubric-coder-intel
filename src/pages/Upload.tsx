import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload as UploadIcon, FileText, Image, FileSpreadsheet, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRubrics } from "@/hooks/useRubrics";
import { useUploadSubmission } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";

const supportedFormats = [
  { icon: FileText, format: ".docx, .pdf", color: "text-blue-500" },
  { icon: FileSpreadsheet, format: ".pptx", color: "text-orange-500" },
  { icon: Image, format: ".png, .jpg", color: "text-green-500" },
];

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: rubrics, isLoading: rubricsLoading } = useRubrics();
  const uploadSubmission = useUploadSubmission();
  
  const [selectedRubric, setSelectedRubric] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !selectedRubric || !user) {
      toast.error("Please select both a file and a rubric");
      return;
    }

    const rubric = rubrics?.find(r => r.id === selectedRubric);
    if (!rubric) {
      toast.error("Selected rubric not found");
      return;
    }

    try {
      const submission = await uploadSubmission.mutateAsync({
        file,
        rubricId: selectedRubric,
        userId: user.id,
        rubricCriteria: rubric.criteria as any[],
      });
      
      navigate(`/results?id=${submission.id}`);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Upload Submission
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your flowchart, algorithm, or pseudocode for AI-powered evaluation
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle>Select Evaluation Rubric</CardTitle>
                <CardDescription>
                  Choose the rubric that matches your submission type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rubricsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <Select value={selectedRubric} onValueChange={setSelectedRubric} disabled={!rubrics || rubrics.length === 0}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={rubrics && rubrics.length > 0 ? "Select a rubric..." : "No rubrics available"} />
                    </SelectTrigger>
                    <SelectContent>
                      {rubrics?.map((rubric) => {
                        const criteria = Array.isArray(rubric.criteria) ? rubric.criteria : [];
                        const criteriaNames = criteria.map((c: any) => c.name).join(', ');
                        return (
                          <SelectItem key={rubric.id} value={rubric.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{rubric.name}</span>
                              <span className="text-xs text-muted-foreground">{criteriaNames || 'No criteria'}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Drag and drop your file or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".docx,.pptx,.pdf,.png,.jpg,.jpeg"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    {file ? (
                      <>
                        <CheckCircle className="w-16 h-16 text-success" />
                        <div>
                          <p className="text-lg font-semibold text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-16 h-16 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-semibold text-foreground mb-2">
                            Drop your file here or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Maximum file size: 10MB
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium text-foreground mb-3">Supported formats:</p>
                  <div className="flex flex-wrap gap-3">
                    {supportedFormats.map((format, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2"
                      >
                        <format.icon className={`w-4 h-4 ${format.color}`} />
                        <span className="text-sm text-secondary-foreground">{format.format}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              variant="hero"
              onClick={handleSubmit}
              disabled={!file || !selectedRubric || uploadSubmission.isPending}
              className="w-full text-lg gap-2"
            >
              {uploadSubmission.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              {uploadSubmission.isPending ? 'Uploading...' : 'Submit for Evaluation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
