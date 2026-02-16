// Mock Media Authenticity Analyzer - Corrected Version
export interface MediaMetadata {
  filename: string;
  fileSize: string;
  dimensions?: string;
  duration?: string;
  codec?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface AuthenticityIndicator {
  name: string;
  status: "authentic" | "suspicious" | "likely_fake";
  confidence: number;
  description: string;
}

export interface MediaAnalysis {
  mediaType: "image" | "audio" | "video";
  authenticityScore: number; // 0-100, higher = more authentic
  verdict: "authentic" | "suspicious" | "likely_deepfake";
  confidenceLevel: "low" | "medium" | "high";
  indicators: AuthenticityIndicator[];
  metadata: MediaMetadata;
  aiExplanation: string;
  technicalFindings: string[];
  recommendations: string[];
  warningFlags: string[];
}

const audioFakeIndicators = [
  { name: "Unnatural Speech Patterns", weight: 20 },
  { name: "Background Noise Inconsistency", weight: 15 },
  { name: "AI Voice Detection", weight: 25 },
  { name: "Audio Compression Artifacts", weight: 12 },
  { name: "Splicing Indicators", weight: 18 },
];

const videoFakeIndicators = [
  { name: "Facial Inconsistencies", weight: 25 },
  { name: "Eye Movement Anomalies", weight: 20 },
  { name: "Lip Sync Issues", weight: 22 },
  { name: "Lighting Discontinuity", weight: 15 },
  { name: "Edge Artifacts", weight: 18 },
];

const imageFakeIndicators = [
  { name: "Metadata Manipulation", weight: 15 },
  { name: "Compression Anomalies", weight: 12 },
  { name: "Pixel Inconsistencies", weight: 18 },
  { name: "AI Generation Markers", weight: 25 },
  { name: "Blending Artifacts", weight: 16 },
];

function generateMetadata(filename: string, type: "image" | "audio" | "video"): MediaMetadata {
  const sizeUnits = ["KB", "MB"];
  const size = Math.floor(Math.random() * 50) + 200;
  const unit = sizeUnits[Math.floor(Math.random() * 2)];
  
  const metadata: MediaMetadata = {
    filename,
    fileSize: `${size}${unit}`,
  };

  if (type === "image") {
    const resolutions = ["1920x1080", "3840x2160", "1280x720", "2560x1440"];
    metadata.dimensions = resolutions[Math.floor(Math.random() * resolutions.length)];
    metadata.codec = "JPEG/PNG";
  } else if (type === "audio") {
    metadata.duration = `${Math.floor(Math.random() * 300)}s`;
    metadata.codec = "MP3/WAV";
  } else if (type === "video") {
    metadata.dimensions = "1920x1080";
    metadata.duration = `${Math.floor(Math.random() * 600)}s`;
    metadata.codec = "H.264/H.265";
  }

  const now = new Date();
  metadata.createdDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
  metadata.modifiedDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return metadata;
}

function generateIndicators(type: "image" | "audio" | "video", riskScore: number): AuthenticityIndicator[] {
  const indicatorSets = {
    image: imageFakeIndicators,
    audio: audioFakeIndicators,
    video: videoFakeIndicators,
  };

  const patterns = indicatorSets[type];
  const indicators: AuthenticityIndicator[] = [];
  
  for (const pattern of patterns) {
    const roll = Math.random() * 100;
    if (roll < (riskScore * 0.6)) {
      indicators.push({
        name: pattern.name,
        status: roll < 30 ? "likely_fake" : "suspicious",
        confidence: 60 + Math.random() * 30,
        description: `Pattern analysis detected potential ${pattern.name.toLowerCase()}.`,
      });
    }
  }

  if (indicators.length === 0) {
    indicators.push({
      name: "Natural Consistency",
      status: "authentic",
      confidence: 85 + Math.random() * 10,
      description: "Standard patterns consistent with authentic media.",
    });
  }

  return indicators;
}

function generateExplanation(type: string, riskScore: number): string {
  if (riskScore < 20) {
    return `This ${type} shows characteristics consistent with authentic content. The metadata, quality, and pattern analysis indicate this is likely genuine media.`;
  }
  if (riskScore < 50) {
    return `This ${type} contains some suspicious patterns that warrant further investigation. There are indicators of potential manipulation or editing.`;
  }
  return `This ${type} exhibits multiple deepfake or forgery indicators. The analysis suggests this may be AI-generated or heavily manipulated.`;
}

function generateTechnicalFindings(type: "image" | "audio" | "video", score: number): string[] {
  const findings: string[] = [];
  
  if (type === "image") {
    findings.push(`Pixel-level analysis: ${score > 50 ? "Anomalies detected" : "Normal patterns"}`);
    findings.push(`Metadata inspection: ${score > 40 ? "Modified or stripped" : "Intact and normal"}`);
    findings.push(`Frequency analysis: ${score > 50 ? "Unusual artifacts" : "Standard compression"}`);
  } else if (type === "audio") {
    findings.push(`Spectral analysis: ${score > 50 ? "Unnatural transitions" : "Natural distribution"}`);
    findings.push(`Voice biometrics: ${score > 50 ? "Synthesis markers detected" : "Human speech"}`);
    findings.push(`Audio coherence: ${score > 40 ? "Background inconsistencies" : "Coherent environment"}`);
  } else if (type === "video") {
    findings.push(`Motion analysis: ${score > 50 ? "Temporal issues" : "Natural motion"}`);
    findings.push(`Facial tracking: ${score > 50 ? "Unnatural geometry" : "Consistent proportions"}`);
    findings.push(`Frame coherence: ${score > 40 ? "Discontinuities found" : "Smooth transitions"}`);
  }

  return findings;
}

function generateRecommendations(score: number): string[] {
  if (score >= 70) {
    return [
      "🚨 High probability of deepfake or forgery",
      "Do not share or rely on this content for decisions",
      "Report to platform moderators if found online",
      "Verify the context and source independently",
      "Use reverse search to find original",
    ];
  }
  if (score >= 40) {
    return [
      "⚠️ Moderate concerns about authenticity",
      "Seek additional verification before sharing",
      "Check metadata and source information",
      "Consult multiple trusted sources",
    ];
  }
  return [
    "✅ Authenticity indicators appear normal",
    "This media likely genuine based on analysis",
    "Always verify important information",
    "No evidence of AI generation detected",
  ];
}

export async function analyzeMedia(file: File): Promise<MediaAnalysis> {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

  // Determine media type
  const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : "video";
  
  // Simulated risk score
  const riskScore = Math.floor(Math.random() * 100);
  const indicators = generateIndicators(type, riskScore);
  const metadata = generateMetadata(file.name, type);
  
  let verdict: "authentic" | "suspicious" | "likely_deepfake";
  let confidenceLevel: "low" | "medium" | "high";

  if (riskScore < 30) {
    verdict = "authentic";
    confidenceLevel = "high";
  } else if (riskScore < 60) {
    verdict = "suspicious";
    confidenceLevel = "medium";
  } else {
    verdict = "likely_deepfake";
    confidenceLevel = "high";
  }

  const warningFlags = indicators
    .filter(i => i.status !== "authentic")
    .map(i => i.name);

  return {
    mediaType: type,
    authenticityScore: 100 - riskScore,
    verdict,
    confidenceLevel,
    indicators,
    metadata,
    aiExplanation: generateExplanation(type, riskScore),
    technicalFindings: generateTechnicalFindings(type, riskScore),
    recommendations: generateRecommendations(riskScore),
    warningFlags,
  };
}