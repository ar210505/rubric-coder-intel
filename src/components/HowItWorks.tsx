import { Upload, Settings, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Submission",
    description: "Upload flowcharts, algorithms, or pseudocode in any supported format",
    step: "01",
  },
  {
    icon: Settings,
    title: "Select Rubric",
    description: "Choose from predefined rubrics or create custom evaluation criteria",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "AI Evaluation",
    description: "Our intelligent engine analyzes the submission against your rubric",
    step: "03",
  },
  {
    icon: Download,
    title: "Get Results",
    description: "Review detailed feedback and scoring with actionable insights",
    step: "04",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-6 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to automated, intelligent evaluation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute -top-3 -right-3 text-6xl font-bold text-primary/10">
                    {step.step}
                  </div>
                  <div className="relative bg-gradient-primary rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary to-accent opacity-30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
