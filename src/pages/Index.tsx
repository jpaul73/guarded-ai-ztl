import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ThreatScanner from "@/components/ThreatScanner/index";
import Footer from "@/components/Footer";
import OnboardingForm from "@/components/OnboardingForm";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("guarded-user-profile");
    setHasProfile(!!saved);
  }, []);

  const handleOnboardingComplete = (name: string, email: string) => {
    const profile = { name, email, joinDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }) };
    localStorage.setItem("guarded-user-profile", JSON.stringify(profile));
    setHasProfile(true);
  };

  if (hasProfile === null) return null; // loading

  if (!hasProfile) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Learn More About GuardEd AI */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/learn">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowRight className="w-5 h-5" />
              Learn More About GuardEd AI
            </Button>
          </Link>
        </div>
      </section>
      
      <ThreatScanner />
      <Footer />
    </div>
  );
};

export default Index;
