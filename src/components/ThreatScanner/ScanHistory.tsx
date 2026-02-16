import { History, Trash2, ChevronDown, ChevronUp, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ScanHistoryItem } from "@/hooks/useScanHistory";
import type { ThreatAnalysis } from "@/lib/mockAIAnalyzer";

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onSelectScan: (result: ThreatAnalysis, input: string) => void;
  onClearHistory: () => void;
  onRemoveScan: (id: string) => void;
}

const ScanHistory = ({ history, onSelectScan, onClearHistory, onRemoveScan }: ScanHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  const getRiskIcon = (level: string) => {
    if (level === "safe") {
      return <CheckCircle className="w-4 h-4 text-primary" />;
    }
    return <AlertTriangle className={`w-4 h-4 ${level === "danger" ? "text-destructive" : "text-warning"}`} />;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-6 border border-border/50 rounded-lg bg-secondary/20">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">Recent Scans ({history.length})</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30 hover:border-primary/30 transition-colors group"
              >
                {getRiskIcon(item.result.riskLevel)}
                
                <button
                  onClick={() => onSelectScan(item.result, item.inputPreview)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-sm text-foreground truncate">
                    {item.inputPreview}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatTime(item.timestamp)}
                    </span>
                    <span className={`text-xs capitalize ${
                      item.result.riskLevel === "safe" 
                        ? "text-primary" 
                        : item.result.riskLevel === "danger" 
                        ? "text-destructive" 
                        : "text-warning"
                    }`}>
                      {item.result.riskLevel}
                    </span>
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveScan(item.id);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove scan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="mt-3 text-muted-foreground hover:text-destructive w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanHistory;
