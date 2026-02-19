import { Shield, Github, Twitter } from "lucide-react";
import ShieldLogo from "./ShieldLogo";
const Footer = () => {
  return <footer className="fixed bottom-0 right-0 bg-gradient-to-l from-blue-600 to-blue-800 p-6 m-4 rounded-lg shadow-lg">
      <div className="text-right">
        <div className="flex flex-col items-end gap-3 mb-4">
          <div className="text-white">
            <p className="text-sm font-semibold tracking-widest uppercase">GuardEd AI</p>
            <p className="text-xs text-blue-100">Safer digital habits explained</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 text-blue-100 mb-4">
          <a href="https://github.com/jpaul73/GuardEd-AI.git" className="hover:text-white transition-colors hover:scale-110">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://github.com/jpaul73/GuardEd-AI.git" className="hover:text-white transition-colors hover:scale-110">
            <Twitter className="w-4 h-4" />
          </a>
        </div>

        <div className="border-t border-blue-400/30 pt-2 text-xs text-blue-100">
          <p>© 2026 ZeroTrust Labs</p>
          <p>No Personal Data collocted</p>
          <p className="text-blue-200 font-semibold">Dev: J Paul Doniyal</p>
        </div>
      </div>
    </footer>;
};
export default Footer;