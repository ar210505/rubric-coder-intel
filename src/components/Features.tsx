import { Code, GitBranch, FileCheck, Zap, Shield, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Code,
    title: "Language-Agnostic",
    description: "Evaluate pseudocode written in any style or convention. Our AI understands logic, not just syntax.",
  },
  {
    icon: GitBranch,
    title: "Flowchart Analysis",
    description: "Intelligent parsing of flowchart structures with support for complex branching and loops.",
  },
  {
    icon: FileCheck,
    title: "Custom Rubrics",
    description: "Create and manage evaluation criteria tailored to your organization's standards.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Get evaluation results in seconds with our optimized AI engine and efficient parsing.",
  },
  {
    icon: Shield,
    title: "Consistent Scoring",
    description: "Eliminate human bias with standardized evaluation criteria applied uniformly.",
  },
  {
    icon: Globe,
    title: "LMS Integration",
    description: "Seamlessly integrate with popular learning management systems for streamlined workflow.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Features for Modern Assessment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built to streamline technical evaluations and accelerate learning outcomes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                <div className="bg-gradient-primary rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
