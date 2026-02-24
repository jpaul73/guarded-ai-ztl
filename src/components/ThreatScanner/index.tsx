import { useState } from "react";
import { analyzeMessage, type ThreatAnalysis } from "@/lib/mockAIAnalyzer";
import { analyzeMedia, type MediaAnalysis } from "@/lib/mockMediaAnalyzer";
import { useScanHistory } from "@/hooks/useScanHistory";
import ScannerInput from "./ScannerInput";
import ScanResult from "./ScanResult";
import MediaScannerInput from "./MediaScannerInput";
import MediaScanResult from "./MediaScanResult";
import ExampleMessages from "./ExampleMessages";
import ScanHistory from "./ScanHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Image as ImageIcon, Loader2 } from "lucide-react";

interface AnalysisResult {
  type: "text" | "media";
  data: ThreatAnalysis | MediaAnalysis;
  timestamp: Date;
}

const ThreatScanner = () => {
  const [scanMode, setScanMode] = useState<"text" | "media">("text");
  const [textInput, setTextInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const { history, addScan, clearHistory, removeScan } = useScanHistory();

  const handleTextScan = async () => {
    if (!textInput.trim()) return;
    
    setIsScanning(true);
    
    try {
      const scanResult = await analyzeMessage(textInput);
      const result: AnalysisResult = {
        type: "text",
        data: scanResult,
        timestamp: new Date(),
      };
      setResults([result, ...results]);
      addScan(textInput, scanResult);
    } finally {
      setIsScanning(false);
    }
  };

  const handleMediaScan = async (file: File) => {
    setIsScanning(true);
    
    try {
      const scanResult = await analyzeMedia(file);
      const result: AnalysisResult = {
        type: "media",
        data: scanResult,
        timestamp: new Date(),
      };
      setResults([result, ...results]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExampleSelect = (message: string) => {
    setTextInput(message);
  };

  return (
    <section id="scanner" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">AI Threat Scanner</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Scan emails, messages, URLs, images, audio, and videos for phishing, malware, deepfakes, and media manipulation. Our AI analyzes threats with advanced detection and explains risks in plain language.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8">
          <Tabs value={scanMode} onValueChange={(v) => setScanMode(v as "text" | "media")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email, Text & URL
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Media (Image/Audio/Video)
              </TabsTrigger>
            </TabsList>

            {/* Text Scanning Tab */}
            <TabsContent value="text" className="space-y-6">
              <ScannerInput 
                input={textInput}
                setInput={setTextInput}
                isScanning={isScanning}
                onScan={handleTextScan}
              />
              
              {isScanning && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                  <span className="text-muted-foreground">Analyzing message...</span>
                </div>
              )}

              {results.length > 0 && results[0].type === "text" && (
                <ScanResult result={results[0].data as ThreatAnalysis} />
              )}

              {results.length === 0 && (
                <>
                  <ExampleMessages onSelect={handleExampleSelect} />
                  <ScanHistory
                    history={history}
                    onSelectScan={(result, input) => setTextInput(input)}
                    onClearHistory={clearHistory}
                    onRemoveScan={removeScan}
                  />
                </>
              )}
            </TabsContent>

            {/* Media Scanning Tab */}
            <TabsContent value="media" className="space-y-6">
              <MediaScannerInput 
                onFileSelect={handleMediaScan}
                isScanning={isScanning}
              />

              {isScanning && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                  <span className="text-muted-foreground">Analyzing media authenticity...</span>
                </div>
              )}

              {results.length > 0 && results[0].type === "media" && (
                <MediaScanResult result={results[0].data as MediaAnalysis} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ThreatScanner;