import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/guarded-ai-logo.png";

const Hero = () => {
  const scrollToScanner = () => {
    document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <img src={logoImage} alt="GuardEd AI" className="h-32 w-auto animate-float" />
        </div>

        {/* Brand name */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-foreground">Guard</span>
            <span className="text-foreground">Ed</span>
            <span className="text-primary"> AI</span>
          </h1>
        </div>

        {/* Tagline */}
        <p 
          className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          Safer digital habits, explained.
        </p>

        {/* Description */}
        <p 
          className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          An AI-powered cybersecurity assistant that detects phishing, explains threats in plain language, 
          and teaches you how to stay safe—without collecting your personal data.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <Button 
            onClick={scrollToScanner}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-lg glow-border group"
          >
            <Shield className="w-5 h-5 mr-2" />
            Scan Message / URL
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-border/50 hover:bg-secondary/50 text-foreground px-8 py-6 text-lg"
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn More
          </Button>
        </div>

        {/* Trust indicators */}
        <div 
          className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground text-sm animate-fade-in"
          style={{ animationDelay: "500ms" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Privacy-First Design</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Explainable AI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Built for Students</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
