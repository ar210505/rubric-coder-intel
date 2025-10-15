import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <img 
              src="/favicon.jpg" 
              alt="EvalAI Logo" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <span className="text-2xl font-bold text-foreground">EVALAI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate("/")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/upload")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Upload
            </button>
            <button 
              onClick={() => navigate("/rubrics")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Rubrics
            </button>
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button variant="hero" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
