import { AlertTriangle, CheckCircle, Shield, ChevronDown, ChevronUp, AlertCircle as AlertIcon, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { MediaAnalysis } from "@/lib/mockMediaAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MediaScanResultProps {
  result: MediaAnalysis;
}

const MediaScanResult = ({ result }: MediaScanResultProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "authentic":
        return "text-primary";
      case "suspicious":
        return "text-warning";
      case "likely_deepfake":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getVerdictBg = (verdict: string) => {
    switch (verdict) {
      case "authentic":
        return "bg-primary/10 border-primary/30";
      case "suspicious":
        return "bg-warning/10 border-warning/30";
      case "likely_deepfake":
        return "bg-destructive/10 border-destructive/30";
      default:
        return "bg-secondary/30 border-border/50";
    }
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case "authentic":
        return "✅ Appears Authentic";
      case "suspicious":
        return "⚠️ Suspicious - Further Verification Needed";
      case "likely_deepfake":
        return "🚨 Likely Deepfake or Heavily Manipulated";
      default:
        return "❓ Unable to Determine";
    }
  };

  const getIndicatorColor = (status: string) => {
    switch (status) {
      case "authentic":
        return "bg-primary/20 text-primary";
      case "suspicious":
        return "bg-warning/20 text-warning";
      case "likely_fake":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className={`mt-8 p-6 rounded-xl border ${getVerdictBg(result.verdict)} animate-scale-in`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {result.verdict === "authentic" ? (
          <CheckCircle className="w-10 h-10 text-primary" />
        ) : (
          <AlertTriangle className={`w-10 h-10 ${getVerdictColor(result.verdict)}`} />
        )}
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${getVerdictColor(result.verdict)}`}>
            {getVerdictLabel(result.verdict)}
          </h3>
          <p className="text-muted-foreground">
            Authenticity Score: {result.authenticityScore}/100 ({result.confidenceLevel} confidence)
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          {result.mediaType.toUpperCase()}
        </Badge>
      </div>

      {/* Warning Flags */}
      {result.warningFlags.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm font-semibold text-destructive mb-2">🚨 Detected Issues:</p>
          <div className="flex flex-wrap gap-2">
            {result.warningFlags.map((flag) => (
              <Badge key={flag} variant="secondary" className="bg-destructive/20 text-destructive">
                {flag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <Card className="mb-6 bg-secondary/30 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            File Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Filename</p>
              <p className="font-mono text-foreground break-all">{result.metadata.filename}</p>
            </div>
            <div>
              <p className="text-muted-foreground">File Size</p>
              <p className="font-mono text-foreground">{result.metadata.fileSize}</p>
            </div>
            {result.metadata.dimensions && (
              <div>
                <p className="text-muted-foreground">Dimensions</p>
                <p className="font-mono text-foreground">{result.metadata.dimensions}</p>
              </div>
            )}
            {result.metadata.duration && (
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-mono text-foreground">{result.metadata.duration}</p>
              </div>
            )}
            {result.metadata.codec && (
              <div>
                <p className="text-muted-foreground">Codec</p>
                <p className="font-mono text-foreground">{result.metadata.codec}</p>
              </div>
            )}
            {result.metadata.createdDate && (
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-mono text-foreground">{result.metadata.createdDate}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Explanation */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{result.aiExplanation}</p>
        </CardContent>
      </Card>

      {/* Authenticity Indicators */}
      <Card className="mb-6 border-border/50">
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-secondary/30 transition-colors"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertIcon className="w-5 h-5 text-primary" />
              Authenticity Indicators
            </CardTitle>
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </CardHeader>
        {showDetails && (
          <CardContent>
            <div className="space-y-3">
              {result.indicators.map((indicator, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getIndicatorColor(indicator.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{indicator.name}</p>
                      <p className="text-xs opacity-75">{indicator.description}</p>
                    </div>
                    <Badge className="ml-2 whitespace-nowrap">{indicator.confidence.toFixed(0)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Technical Findings */}
      <Card className="mb-6 border-border/50">
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-secondary/30 transition-colors"
          onClick={() => setShowTechnical(!showTechnical)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Technical Analysis</CardTitle>
            {showTechnical ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </CardHeader>
        {showTechnical && (
          <CardContent>
            <ul className="space-y-2">
              {result.technicalFindings.map((finding, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {finding}
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>

      {/* Recommendations */}
      <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
        <p className="font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Recommendations
        </p>
        <ul className="space-y-2">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-foreground flex gap-2">
              <span className="text-primary">→</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MediaScanResult;