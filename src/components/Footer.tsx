import { Shield, Github, Twitter } from "lucide-react";
import ShieldLogo from "./ShieldLogo";
const Footer = () => {
  return <footer className="border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ShieldLogo />
            <div>
              <span className="font-bold text-foreground">GuardEd AI</span>
              <p className="text-sm text-muted-foreground">Safer digital habits, explained.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-muted-foreground">
            <a href="https://github.com/jpaul73/GuardEd-AI.git" className="hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://github.com/jpaul73/GuardEd-AI.git" className="hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
          <p>© 2026 ZeroTrust Labs. Built for safer digital experiences.</p>
          <p className="mt-2">No personal data is collected or stored.</p>
          <p>Project By ZeroTrust Labs Develpoer: J Paul Doniyal </p>
        </div>
      </div>
    </footer>;
};
export default Footer;