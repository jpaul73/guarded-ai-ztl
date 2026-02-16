import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/guarded-ai-logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="GuardEd AI" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection("features")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
             <Link to="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
               Learn
             </Link>
            <Link to="/labs" className="text-muted-foreground hover:text-foreground transition-colors">
              Labs
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
              Profile
            </Link>
            <Button 
              onClick={() => scrollToSection("scanner")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
               Scan Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Features
              </button>
             <Link 
               to="/learn"
               className="text-muted-foreground hover:text-foreground transition-colors py-2"
               onClick={() => setIsMenuOpen(false)}
              >
               Learn
             </Link>
              <Link 
                to="/labs"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Labs
              </Link>
              <Link 
                to="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Button 
                onClick={() => scrollToSection("scanner")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              >
               Scan Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
