import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">AI-Powered Evaluation System</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Intelligent Rubrics-Based Evaluator
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Automate assessment of flowcharts, algorithms, and pseudocode with precision and consistency. 
            Powered by AI to provide instant, detailed feedback.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              variant="hero"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <FileText className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Format Support</h3>
              <p className="text-white/80 text-sm">
                Process .docx, .pptx, .pdf, .png, and .jpg files seamlessly
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CheckCircle className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Rubric-Based Scoring</h3>
              <p className="text-white/80 text-sm">
                Define custom rubrics for consistent and objective evaluation
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <Brain className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Feedback</h3>
              <p className="text-white/80 text-sm">
                Get detailed, actionable feedback in seconds, not hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
