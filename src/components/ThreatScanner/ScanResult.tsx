import { AlertTriangle, CheckCircle, Shield, Brain, BookOpen, Lightbulb, ChevronDown, ChevronUp, Mail, Building2, UserCheck, UserX, HelpCircle, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import type { ThreatAnalysis } from "@/lib/mockAIAnalyzer";

interface ScanResultProps {
  result: ThreatAnalysis;
}

const ScanResult = ({ result }: ScanResultProps) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const [showTeachBack, setShowTeachBack] = useState(true);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "danger": return "text-destructive";
      case "warning": return "text-warning";
      default: return "text-primary";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "danger": return "bg-destructive/10 border-destructive/30";
      case "warning": return "bg-warning/10 border-warning/30";
      default: return "bg-primary/10 border-primary/30";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-destructive/70 text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getVerificationIcon = () => {
    switch (result.senderVerification.verificationStatus) {
      case "legitimate": return <UserCheck className="w-6 h-6 text-primary" />;
      case "fake": return <UserX className="w-6 h-6 text-destructive" />;
      case "suspicious": return <AlertTriangle className="w-6 h-6 text-warning" />;
      default: return <HelpCircle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getVerificationBg = () => {
    switch (result.senderVerification.verificationStatus) {
      case "legitimate": return "bg-primary/10 border-primary/30";
      case "fake": return "bg-destructive/10 border-destructive/30";
      case "suspicious": return "bg-warning/10 border-warning/30";
      default: return "bg-secondary/30 border-border/50";
    }
  };

  const getStatusLabel = () => {
    switch (result.senderVerification.verificationStatus) {
      case "legitimate": return "Verified Legitimate";
      case "fake": return "Likely Fake / Impersonation";
      case "suspicious": return "Suspicious - Unverified";
      default: return "Unknown Sender";
    }
  };

  const sv = result.senderVerification;

  return (
    <div className={`mt-8 p-6 rounded-xl border ${getRiskBg(result.riskLevel)} animate-scale-in`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {result.riskLevel === "safe" ? (
          <CheckCircle className="w-10 h-10 text-primary" />
        ) : (
          <AlertTriangle className={`w-10 h-10 ${getRiskColor(result.riskLevel)}`} />
        )}
        <div>
          <h3 className={`text-2xl font-bold capitalize ${getRiskColor(result.riskLevel)}`}>
            {result.riskLevel === "safe" ? "Appears Safe" : `${result.riskLevel} Level Risk`}
          </h3>
          <p className="text-muted-foreground">
            AI Confidence Score: {result.confidenceScore}/100
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">AI Analyzed</span>
        </div>
      </div>

      {/* Sender Verification */}
      <div className={`mb-6 p-4 rounded-xl border ${getVerificationBg()}`}>
        <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Sender & Company Verification
        </h4>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 rounded-lg bg-background/50">
            {getVerificationIcon()}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                sv.verificationStatus === "legitimate" ? "bg-primary/20 text-primary" :
                sv.verificationStatus === "fake" ? "bg-destructive/20 text-destructive" :
                sv.verificationStatus === "suspicious" ? "bg-warning/20 text-warning" :
                "bg-muted text-muted-foreground"
              }`}>
                {getStatusLabel()}
              </span>
            </div>

            {sv.senderEmail && (
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Sender Email:</span>{" "}
                <code className="bg-background/50 px-2 py-0.5 rounded text-sm">{sv.senderEmail}</code>
              </p>
            )}
            {sv.senderName && (
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Sender Name:</span> {sv.senderName}
              </p>
            )}
            {sv.companyName && (
              <p className="text-sm text-foreground flex items-center gap-1">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Company:</span>{" "}
                <span className="capitalize font-medium">{sv.companyName}</span>
              </p>
            )}

            <p className="text-sm text-foreground leading-relaxed mt-2">{sv.verificationDetails}</p>

            {sv.companyInfo && (
              <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <p className="text-xs font-medium text-primary mb-1">📋 Company Information</p>
                <p className="text-sm text-muted-foreground">{sv.companyInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Threat Categories */}
      {result.threatCategories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Detected Threat Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.threatCategories.map((category, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(category.severity)}`}>
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* URL Analysis */}
      {result.urlAnalysis && result.urlAnalysis.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-primary" />
            URL Analysis ({result.urlAnalysis.length} found)
          </h4>
          <div className="space-y-3">
            {result.urlAnalysis.map((url, i) => {
              const getRiskIcon = (level: string) => {
                switch (level) {
                  case "danger": return "🚨";
                  case "warning": return "⚠️";
                  default: return "✅";
                }
              };
              const getRiskBgUrl = (level: string) => {
                switch (level) {
                  case "danger": return "bg-destructive/10 border-destructive/30";
                  case "warning": return "bg-warning/10 border-warning/30";
                  default: return "bg-primary/10 border-primary/30";
                }
              };
              
              return (
                <div key={i} className={`p-3 rounded-lg border ${getRiskBgUrl(url.riskLevel)}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{getRiskIcon(url.riskLevel)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          url.riskLevel === "danger" ? "bg-destructive/20 text-destructive" :
                          url.riskLevel === "warning" ? "bg-warning/20 text-warning" :
                          "bg-primary/20 text-primary"
                        }`}>
                          {url.threatType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-mono break-all">{url.url}</p>
                      <p className="text-sm text-foreground mt-2">{url.details}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* AI Explanation */}
      <div className="mb-6 bg-secondary/30 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
          <Brain className="w-4 h-4" />
          AI Analysis
        </h4>
        <p className="text-foreground leading-relaxed whitespace-pre-line">{result.aiExplanation}</p>
      </div>

      {/* Technical Details */}
      <div className="mb-6">
        <button onClick={() => setShowTechnical(!showTechnical)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="text-sm">Technical Details</span>
        </button>
        {showTechnical && (
          <div className="mt-3 p-4 bg-background/50 rounded-lg border border-border/50">
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{result.technicalDetails}</pre>
          </div>
        )}
      </div>

      {/* Teach-Back Lesson */}
      <div className="mb-6">
        <button onClick={() => setShowTeachBack(!showTeachBack)} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-3">
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">Learn: {result.teachBackLesson.title}</span>
          {showTeachBack ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showTeachBack && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h5 className="font-medium text-foreground mb-2">What Happened</h5>
              <p className="text-sm text-muted-foreground">{result.teachBackLesson.whatHappened}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h5 className="font-medium text-foreground mb-2">Why It's Dangerous</h5>
              <p className="text-sm text-muted-foreground">{result.teachBackLesson.whyDangerous}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h5 className="font-medium text-foreground mb-2">How to Stay Safe</h5>
              <p className="text-sm text-muted-foreground">{result.teachBackLesson.howToAvoid}</p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Lightbulb className="w-4 h-4" />
          What You Should Do
        </h4>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-foreground">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScanResult;
