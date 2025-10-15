import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Index;
