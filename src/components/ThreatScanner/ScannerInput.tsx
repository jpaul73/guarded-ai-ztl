import { Search, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ScannerInputProps {
  input: string;
  setInput: (value: string) => void;
  isScanning: boolean;
  onScan: () => void;
}

const ScannerInput = ({ input, setInput, isScanning, onScan }: ScannerInputProps) => {
  return (
    <>
      <div className="relative">
        <Textarea
          placeholder="Paste a suspicious email, message, URL, or link here to scan for phishing, malware, and deepfakes..."
          className="min-h-[150px] bg-input/50 border-border/50 resize-none text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        {isScanning && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Shield className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 w-full h-1 bg-primary/30 overflow-hidden rounded">
                  <div className="scan-line h-full animate-scan" />
                </div>
              </div>
              <span className="text-primary font-medium">AI analyzing threat patterns...</span>
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={onScan} 
        disabled={!input.trim() || isScanning}
        className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg glow-border"
      >
        {isScanning ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            AI Scanning...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Scan with AI
          </>
        )}
      </Button>
    </>
  );
};

export default ScannerInput;
