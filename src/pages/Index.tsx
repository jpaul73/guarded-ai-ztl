import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ThreatScanner from "@/components/ThreatScanner/index";
import Footer from "@/components/Footer";
import OnboardingForm from "@/components/OnboardingForm";

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
      <ThreatScanner />
      <Footer />
    </div>
  );
};

export default Index;
