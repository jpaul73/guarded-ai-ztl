import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logoImage from "@/assets/guarded-ai-logo.png";

interface OnboardingFormProps {
  onComplete: (name: string, email: string) => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (name.trim().length > 100) {
      toast.error("Name must be less than 100 characters");
      return;
    }

    onComplete(name.trim(), email.trim());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <img src={logoImage} alt="GuardEd AI" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to GuardEd AI</h1>
          <p className="text-muted-foreground">
            Enter your details to get started with cybersecurity learning
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="onboard-name">Username</Label>
            <Input
              id="onboard-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your username"
              className="bg-input border-border"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onboard-email">Email Address</Label>
            <Input
              id="onboard-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-input border-border"
              maxLength={255}
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Shield className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Your data stays private. All progress is stored locally in your browser.
        </p>
      </div>
    </div>
  );
};

export default OnboardingForm;
