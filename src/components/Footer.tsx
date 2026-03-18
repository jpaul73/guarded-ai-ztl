import { Shield, Github, Twitter } from "lucide-react";
import ShieldLogo from "./ShieldLogo";
const Footer = () => {
  return <footer className="bg-background border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-10">
          <div className="text-left flex-1">
            <div className="text-foreground mb-4">
              <p className="text-sm font-semibold tracking-widest uppercase">GuardEd AI</p>
              <p className="text-xs text-muted-foreground">Safer digital habits explained</p>
            </div>

            <div className="border-t border-border pt-4 text-xs text-muted-foreground">
              <p>© 2026 ZeroTrust Labs</p>
              <p>No Personal Data collected</p>
              <p className="text-foreground font-semibold">Dev: Cyber Engineers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="https://github.com/jpaul73/GuardEd-AI.git" className="hover:text-foreground transition-colors hover:scale-110">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://github.com/jpaul73/GuardEd-AI.git" className="hover:text-foreground transition-colors hover:scale-110">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;