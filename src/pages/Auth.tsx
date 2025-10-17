import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, Info, CheckCircle2, XCircle, Mail } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password validation rules
  const passwordRules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !isPasswordValid) {
      toast({
        title: "Invalid Password",
        description: "Please meet all password requirements",
        variant: "destructive",
      });
      return;
    }

    if (!isEmailValid) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ 
          title: "Welcome back!",
          description: "Successfully signed in"
        });
        navigate("/dashboard");
      } else {
        // Sign up with email verification
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        if (data?.user) {
          setTempUserId(data.user.id);
          setShowVerification(true);
          toast({ 
            title: "Verification Email Sent!",
            description: "Please check your email and enter the verification code."
          });
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, you would verify the OTP with Supabase
      // For now, we'll use Supabase's built-in email verification
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup'
      });

      if (error) throw error;

      toast({ 
        title: "Account Verified!",
        description: "You can now sign in to your account."
      });
      setShowVerification(false);
      setIsLogin(true);
      setVerificationCode("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Check your email inbox and spam folder for the verification code.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowVerification(false);
                  setVerificationCode("");
                }}
              >
                Back to Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-border shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to start evaluating your submissions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`transition-all focus:ring-2 focus:ring-primary ${
                    email && !isEmailValid ? 'border-red-500' : ''
                  }`}
                />
                {email && (
                  isEmailValid ? (
                    <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )
                )}
              </div>
              {email && !isEmailValid && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password *</Label>
                {!isLogin && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Requirements
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Password must contain:</h4>
                        <ul className="space-y-1 text-xs">
                          <li className={`flex items-center gap-2 ${passwordRules.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {passwordRules.minLength ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            At least 8 characters
                          </li>
                          <li className={`flex items-center gap-2 ${passwordRules.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {passwordRules.hasUppercase ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            One uppercase letter (A-Z)
                          </li>
                          <li className={`flex items-center gap-2 ${passwordRules.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {passwordRules.hasLowercase ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            One lowercase letter (a-z)
                          </li>
                          <li className={`flex items-center gap-2 ${passwordRules.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {passwordRules.hasNumber ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            One number (0-9)
                          </li>
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`pr-10 transition-all focus:ring-2 focus:ring-primary ${
                    !isLogin && password && !isPasswordValid ? 'border-red-500' : ''
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {!isLogin && password && (
                <div className="space-y-1">
                  {!passwordRules.minLength && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> At least 8 characters required
                    </p>
                  )}
                  {password.length >= 8 && !isPasswordValid && (
                    <p className="text-xs text-amber-500">
                      Include uppercase, lowercase, and number
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              disabled={loading || (!isLogin && (!isPasswordValid || !isEmailValid || !fullName))}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword("");
                setFullName("");
                setEmail("");
              }}
              className="mt-4 text-primary hover:underline font-medium"
            >
              {isLogin ? "Create new account" : "Sign in instead"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
