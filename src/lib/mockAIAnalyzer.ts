// Mock AI analyzer that simulates LLM-powered phishing detection
// Provides realistic, dynamic explanations for demo/hackathon purposes

export interface URLAnalysis {
  url: string;
  riskLevel: "safe" | "warning" | "danger";
  threatType: string;
  details: string;
}

export interface SenderVerification {
  senderEmail: string | null;
  senderName: string | null;
  companyName: string | null;
  isVerified: boolean;
  verificationStatus: "legitimate" | "suspicious" | "fake" | "unknown";
  verificationDetails: string;
  companyInfo: string | null;
}

export interface ThreatAnalysis {
  riskLevel: "safe" | "warning" | "danger";
  confidenceScore: number;
  threatCategories: ThreatCategory[];
  aiExplanation: string;
  technicalDetails: string;
  teachBackLesson: TeachBackLesson;
  recommendations: string[];
  senderVerification: SenderVerification;
  urlAnalysis?: URLAnalysis[];
}

interface ThreatCategory {
  name: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  indicators: string[];
}

interface TeachBackLesson {
  title: string;
  whatHappened: string;
  whyDangerous: string;
  howToAvoid: string;
}

// Known legitimate companies database (mock)
const knownCompanies: Record<string, { domains: string[]; description: string; founded: string }> = {
  "google": { domains: ["google.com", "gmail.com", "youtube.com"], description: "Google LLC is an American multinational technology company specializing in Internet-related services and products.", founded: "1998" },
  "microsoft": { domains: ["microsoft.com", "outlook.com", "hotmail.com", "live.com"], description: "Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, and related services.", founded: "1975" },
  "apple": { domains: ["apple.com", "icloud.com"], description: "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.", founded: "1976" },
  "amazon": { domains: ["amazon.com", "aws.amazon.com"], description: "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.", founded: "1994" },
  "paypal": { domains: ["paypal.com"], description: "PayPal Holdings, Inc. is an American multinational financial technology company operating an online payments system.", founded: "1998" },
  "netflix": { domains: ["netflix.com"], description: "Netflix, Inc. is an American subscription video on-demand OTT streaming service.", founded: "1997" },
  "facebook": { domains: ["facebook.com", "meta.com", "instagram.com"], description: "Meta Platforms, Inc. (formerly Facebook) is an American multinational technology conglomerate.", founded: "2004" },
  "twitter": { domains: ["twitter.com", "x.com"], description: "X Corp. (formerly Twitter) is an American social media company.", founded: "2006" },
  "bank of america": { domains: ["bankofamerica.com", "bofa.com"], description: "Bank of America Corporation is an American multinational investment bank and financial services holding company.", founded: "1998" },
  "chase": { domains: ["chase.com", "jpmorgan.com"], description: "JPMorgan Chase & Co. is an American multinational financial services firm.", founded: "2000" },
};

// Suspicious domain patterns
const suspiciousDomainPatterns = [
  /\.(ru|cn|tk|ml|ga|cf|xyz|top|buzz|click|link|info)$/i,
  /\d{3,}/,
  /(secure|login|verify|update|confirm|account).*\./i,
  /[a-z]+-[a-z]+-[a-z]+\./i,
];

// URL threat patterns for comprehensive analysis
const urlThreatPatterns = [
  { regex: /https?:\/\/(.*?)(@|\/|\?|$)/i, name: "URL with Credentials", risk: "high" },
  { regex: /https?:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]/i, name: "IP Address Instead of Domain", risk: "high" },
  { regex: /(bit\.ly|tinyurl|short\.link|t\.co|goo\.gl|ow\.ly|bit\.do|adf\.ly)/i, name: "Shortened URL", risk: "high" },
  { regex: /https?:\/\/[^\/]*\.(ru|cn|tk|ml|ga|cf|xyz|top|buzz|click|link|info)([\/\?]|$)/i, name: "Suspicious TLD", risk: "high" },
  { regex: /https?:\/\/.*(%20|--).*\./i, name: "URL Obfuscation", risk: "medium" },
  { regex: /http:\/\/[^\s]+/i, name: "Unencrypted HTTP", risk: "medium" },
  { regex: /https?:\/\/.*[a-z0-9]*-[a-z0-9]*-[a-z0-9]*\./i, name: "Multiple Hyphens (Typosquatting)", risk: "high" },
  { regex: /https?:\/\/[^\/]*apple[^\/]*@/i, name: "Account Hijacking Format", risk: "critical" },
  { regex: /https?:\/\/[^\/]*secure[-_]?login/i, name: "Fake Login Page URL", risk: "critical" },
];

// Extract and analyze URLs from text
function analyzeURLs(input: string): URLAnalysis[] {
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const urls = input.match(urlRegex) || [];
  const analyzed: URLAnalysis[] = [];
  const seenUrls = new Set<string>();

  for (const url of urls) {
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    let riskLevel: "safe" | "warning" | "danger" = "safe";
    let threatType = "Legitimate URL";
    let details = "This URL appears to be safe, but always exercise caution before clicking.";

    // Check against URL threat patterns
    for (const pattern of urlThreatPatterns) {
      if (pattern.regex.test(url)) {
        threatType = pattern.name;
        riskLevel = pattern.risk === "critical" ? "danger" : pattern.risk === "high" ? "warning" : "warning";

        switch (pattern.name) {
          case "Shortened URL":
            details = "Shortened URLs hide the real destination. Attackers use these to disguise malicious links.";
            break;
          case "Suspicious TLD":
            details = "This URL uses a suspicious top-level domain commonly associated with phishing and malware.";
            break;
          case "IP Address Instead of Domain":
            details = "URLs using IP addresses instead of domain names are often used to bypass security filters.";
            break;
          case "Unencrypted HTTP":
            details = "HTTP connections are not encrypted. Legitimate financial sites always use HTTPS.";
            break;
          case "URL Obfuscation":
            details = "This URL uses encoding or special characters to hide its true destination.";
            break;
          case "Fake Login Page URL":
            details = "This URL structure is commonly used to create fake login pages for credential theft.";
            break;
          case "Account Hijacking Format":
            details = "This URL format (using @ symbol) is a classic indicator of phishing. The browser will connect to the server after @, not before.";
            break;
          case "Multiple Hyphens (Typosquatting)":
            details = "Multiple hyphens are often used to mimic legitimate URLs through typosquatting attacks.";
            break;
          case "URL with Credentials":
            details = "Never include credentials in URLs. This data could be logged and exposed in browser history.";
            break;
        }
        break;
      }
    }

    // Check for domain reputation
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      // Check if domain matches known legitimate companies
      let isKnownLegit = false;
      for (const [_, info] of Object.entries(knownCompanies)) {
        if (info.domains.some(d => domain === d || domain.endsWith('.' + d))) {
          isKnownLegit = true;
          riskLevel = "safe";
          threatType = "Known Legitimate Domain";
          details = "This URL belongs to a known, legitimate company. However, verify the page content is as expected.";
          break;
        }
      }

      // Check for typosquatting in legitimate domains
      if (!isKnownLegit) {
        for (const [companyName, info] of Object.entries(knownCompanies)) {
          for (const legit of info.domains) {
            const similarity = calculateSimilarity(domain, legit);
            if (similarity > 0.65 && similarity < 1) {
              riskLevel = "danger";
              threatType = "Possible Typosquatting (Impersonation)";
              details = `This domain "${domain}" closely mimics the legitimate domain "${legit}" from ${companyName}. This is a common phishing technique.`;
              break;
            }
          }
        }
      }

      // Additional domain checks
      if (riskLevel === "safe" && threatType === "Legitimate URL") {
        // Check for suspicious patterns in domain
        if (/[0-9]{3,}/.test(domain)) {
          riskLevel = "warning";
          threatType = "Domain with Unusual Numeric Pattern";
          details = "This domain contains an unusual number of consecutive digits, often seen in phishing URLs.";
        }
      }
    } catch {
      // Invalid URL format
      riskLevel = "warning";
      threatType = "Malformed URL";
      details = "This URL appears to be malformed or invalid. It may not work as intended.";
    }

    analyzed.push({ url, riskLevel, threatType, details });
  }

  return analyzed;
}

function extractSenderInfo(input: string): { email: string | null; name: string | null; company: string | null } {
  // Extract email
  const emailMatch = input.match(/[\w.+-]+@[\w.-]+\.\w+/i);
  const email = emailMatch ? emailMatch[0] : null;

  // Extract "From:" name
  const fromMatch = input.match(/from:\s*([^<\n]+?)(?:\s*<|$)/i);
  const name = fromMatch ? fromMatch[1].trim() : null;

  // Try to identify company from email domain or content
  let company: string | null = null;
  if (email) {
    const domain = email.split("@")[1]?.toLowerCase();
    for (const [companyName, info] of Object.entries(knownCompanies)) {
      if (info.domains.some(d => domain?.includes(d) || domain?.includes(companyName.replace(/\s/g, '')))) {
        company = companyName;
        break;
      }
    }
  }

  // Also check content for company mentions
  if (!company) {
    for (const companyName of Object.keys(knownCompanies)) {
      if (input.toLowerCase().includes(companyName)) {
        company = companyName;
        break;
      }
    }
  }

  return { email, name, company };
}

function verifySender(input: string, threatScore: number): SenderVerification {
  const { email, name, company } = extractSenderInfo(input);

  if (!email && !company) {
    return {
      senderEmail: null, senderName: name, companyName: null,
      isVerified: false, verificationStatus: "unknown",
      verificationDetails: "No sender email or company could be identified in this message. Be cautious with anonymous communications.",
      companyInfo: null,
    };
  }

  const domain = email?.split("@")[1]?.toLowerCase() || "";

  // Check if domain is from known company
  let matchedCompany: string | null = null;
  let isRealDomain = false;
  for (const [companyName, info] of Object.entries(knownCompanies)) {
    if (info.domains.some(d => domain === d)) {
      matchedCompany = companyName;
      isRealDomain = true;
      break;
    }
  }

  // Check for typosquatting (similar but not matching)
  let isTyposquat = false;
  if (!isRealDomain && company) {
    const companyInfo = knownCompanies[company];
    if (companyInfo) {
      for (const legit of companyInfo.domains) {
        const similarity = calculateSimilarity(domain, legit);
        if (similarity > 0.6 && similarity < 1) {
          isTyposquat = true;
          break;
        }
      }
    }
  }

  // Check for suspicious domain patterns
  const isSuspiciousDomain = suspiciousDomainPatterns.some(p => p.test(domain));

  // Determine verification status
  let status: SenderVerification["verificationStatus"];
  let details: string;
  let companyInfo: string | null = null;

  if (isRealDomain && matchedCompany && threatScore < 30) {
    status = "legitimate";
    const info = knownCompanies[matchedCompany];
    companyInfo = `${info.description} Founded: ${info.founded}. Official domains: ${info.domains.join(", ")}`;
    details = `✅ The sender email domain (${domain}) matches the official domain of ${matchedCompany}. This appears to be a legitimate sender. However, always verify the content of the message independently.`;
  } else if (isTyposquat) {
    status = "fake";
    const realCompany = company ? knownCompanies[company] : null;
    companyInfo = realCompany ? `The REAL ${company} uses: ${realCompany.domains.join(", ")}. ${realCompany.description}` : null;
    details = `🚨 FAKE SENDER DETECTED! The domain "${domain}" is a typosquatting attempt designed to look like a legitimate company. The real company uses different domains. This is a common phishing technique.`;
  } else if (isSuspiciousDomain) {
    status = "suspicious";
    details = `⚠️ The sender domain "${domain}" uses a suspicious top-level domain commonly associated with phishing operations. Legitimate companies rarely use these domain extensions.`;
  } else if (company && !isRealDomain) {
    status = "suspicious";
    const realCompany = knownCompanies[company];
    companyInfo = realCompany ? `The REAL ${company} uses: ${realCompany.domains.join(", ")}. ${realCompany.description}` : null;
    details = `⚠️ This message claims to be from ${company}, but the sender email domain "${domain}" does not match any known official domain. This could be an impersonation attempt.`;
  } else if (threatScore >= 50) {
    status = "fake";
    details = `🚨 Combined with the high threat score, this sender appears to be fraudulent. The email address and content patterns indicate this is likely a scam or phishing attempt.`;
  } else {
    status = "unknown";
    details = `The sender "${email || 'unknown'}" could not be verified against known company databases. Exercise caution and verify through official channels.`;
  }

  return {
    senderEmail: email,
    senderName: name,
    companyName: matchedCompany || company,
    isVerified: status === "legitimate",
    verificationStatus: status,
    verificationDetails: details,
    companyInfo,
  };
}

function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) matches++;
  }
  return matches / longer.length;
}

// Sophisticated pattern detection with weighted scoring
const threatPatterns = [
  { regex: /\b(urgent|immediately|act now|limited time|expires|deadline|within 24 hours|right away)\b/gi, category: "Urgency Tactics", weight: 15, severity: "medium" as const },
  { regex: /\b(last chance|final notice|don't wait|hurry|time sensitive)\b/gi, category: "Urgency Tactics", weight: 12, severity: "medium" as const },
  { regex: /\b(verify your (account|identity|email)|confirm your (password|details|information))\b/gi, category: "Credential Harvesting", weight: 25, severity: "critical" as const },
  { regex: /\b(update your (payment|billing|account)|re-enter your password)\b/gi, category: "Credential Harvesting", weight: 22, severity: "critical" as const },
  { regex: /\b(login|sign in|click here to verify)\b/gi, category: "Credential Harvesting", weight: 10, severity: "high" as const },
  { regex: /\b(password|credit card|ssn|social security|bank account|routing number)\b/gi, category: "Sensitive Data Request", weight: 30, severity: "critical" as const },
  { regex: /\b(cvv|expiration date|pin|security code|mother's maiden name)\b/gi, category: "Sensitive Data Request", weight: 28, severity: "critical" as const },
  { regex: /\b(click here|click below|click this link|follow this link)\b/gi, category: "Suspicious Link Invitation", weight: 12, severity: "medium" as const },
  { regex: /(bit\.ly|tinyurl|short\.link|t\.co|goo\.gl|ow\.ly)/gi, category: "Shortened URL", weight: 18, severity: "high" as const },
  { regex: /http:\/\/[^\s]+/gi, category: "Insecure HTTP Link", weight: 15, severity: "high" as const },
  { regex: /\b(winner|won|prize|lottery|congratulations|selected|reward)\b/gi, category: "Prize Scam", weight: 25, severity: "high" as const },
  { regex: /\b(claim your|collect your|receive your (prize|reward|winnings))\b/gi, category: "Prize Scam", weight: 28, severity: "high" as const },
  { regex: /\b(suspended|locked|limited|disabled|terminated|blocked|compromised)\b/gi, category: "Fear-Based Manipulation", weight: 20, severity: "high" as const },
  { regex: /\b(unauthorized (access|activity)|security (alert|warning|breach))\b/gi, category: "Fear-Based Manipulation", weight: 22, severity: "high" as const },
  { regex: /\b(wire transfer|western union|money gram|bitcoin|crypto|gift card)\b/gi, category: "Financial Scam", weight: 30, severity: "critical" as const },
  { regex: /\b(nigerian prince|inheritance|beneficiary|unclaimed funds)\b/gi, category: "Advance Fee Fraud", weight: 35, severity: "critical" as const },
  { regex: /\b(dear (customer|user|member|valued)|your account has been)\b/gi, category: "Generic Impersonation", weight: 8, severity: "medium" as const },
  { regex: /\b(from:.*@(?!gmail|outlook|yahoo|icloud|proton).*\.(ru|cn|tk|ml|ga|cf))/gi, category: "Suspicious Domain", weight: 20, severity: "high" as const },
  { regex: /\b(i need your help|can you do me a favor|please help me|between us)\b/gi, category: "Social Engineering", weight: 15, severity: "medium" as const },
  { regex: /\b(don't tell anyone|keep this private|confidential)\b/gi, category: "Social Engineering", weight: 12, severity: "medium" as const },
];

function generateAIExplanation(categories: ThreatCategory[], score: number): string {
  if (categories.length === 0) {
    return "I analyzed this message using natural language processing and pattern recognition. No significant phishing indicators were detected. The language appears neutral, and there are no suspicious requests for personal information or urgent action demands. However, always exercise caution with unexpected messages.";
  }
  const primaryThreat = categories[0];
  const threatNames = categories.map(c => c.name).join(", ");
  const explanations: Record<string, string> = {
    "Credential Harvesting": `This message exhibits classic credential harvesting tactics. The sender is attempting to trick you into revealing your login credentials or personal information by pretending to be a legitimate service. Legitimate organizations never ask you to verify your password via email or text.`,
    "Sensitive Data Request": `I detected explicit requests for sensitive personal or financial information. This is a major red flag. No legitimate company will ask for your full credit card number, SSN, or password through email or messaging.`,
    "Prize Scam": `This appears to be a lottery or prize scam. The message uses excitement about winning to lower your defenses. Remember: you can't win a lottery you never entered, and legitimate prizes never require upfront payments.`,
    "Fear-Based Manipulation": `This message uses fear tactics to create panic and pressure you into acting without thinking. Phrases about account suspension or security threats are designed to bypass your critical thinking.`,
    "Financial Scam": `I identified language associated with financial fraud, including requests for wire transfers or alternative payment methods. These payment methods are favorites of scammers because they're difficult to trace or reverse.`,
    "Urgency Tactics": `The message creates artificial urgency to pressure you into quick action. Scammers use time pressure to prevent you from carefully evaluating the request or consulting with others.`,
    "Shortened URL": `This message contains shortened URLs that obscure the true destination. Attackers use URL shorteners to hide malicious websites that could steal your data or install malware.`,
    "Advance Fee Fraud": `This is a classic advance fee fraud scheme. The sender promises large sums of money in exchange for a small upfront payment. These payments escalate and the promised funds never materialize.`,
  };
  const primaryExplanation = explanations[primaryThreat.name] || `This message contains ${primaryThreat.name.toLowerCase()} indicators that are commonly associated with phishing attacks.`;
  return `${primaryExplanation}\n\nOverall, I detected ${categories.length} threat categories: ${threatNames}. The combined risk score of ${score}/100 indicates ${score >= 50 ? "a high-confidence phishing attempt" : "suspicious patterns that warrant caution"}.`;
}

function generateTechnicalDetails(input: string, categories: ThreatCategory[], urlAnalysis: URLAnalysis[]): string {
  const wordCount = input.split(/\s+/).length;
  const urlCount = (input.match(/https?:\/\/[^\s]+/g) || []).length;
  const exclamationCount = (input.match(/!/g) || []).length;
  const capsRatio = (input.match(/[A-Z]/g) || []).length / input.length;
  let details = `**Analysis Summary:**\n`;
  details += `- Message length: ${wordCount} words\n`;
  details += `- URLs detected: ${urlCount}\n`;
  details += `- Exclamation marks: ${exclamationCount}\n`;
  details += `- Caps ratio: ${(capsRatio * 100).toFixed(1)}%\n\n`;
  
  if (urlAnalysis.length > 0) {
    details += `**URL Analysis:**\n`;
    urlAnalysis.forEach((url) => {
      const riskIcon = url.riskLevel === "danger" ? "🚨" : url.riskLevel === "warning" ? "⚠️" : "✅";
      details += `- ${riskIcon} ${url.threatType}: ${url.url}\n`;
    });
    details += `\n`;
  }
  
  if (categories.length > 0) {
    details += `**Pattern Matches:**\n`;
    categories.forEach(cat => {
      details += `- ${cat.name} (${cat.severity} severity): ${cat.indicators.length} indicator(s) found\n`;
    });
  }
  return details;
}

function generateTeachBackLesson(categories: ThreatCategory[], score: number): TeachBackLesson {
  if (score < 20) {
    return { title: "Good Digital Hygiene", whatHappened: "This message doesn't show obvious signs of phishing, but staying alert is always important.", whyDangerous: "Even seemingly safe messages can be sophisticated attacks. Scammers constantly evolve their tactics.", howToAvoid: "Always verify sender identity independently, never click links in unexpected messages, and trust your instincts if something feels off." };
  }
  const primary = categories[0];
  const lessons: Record<string, TeachBackLesson> = {
    "Credential Harvesting": { title: "Understanding Credential Theft", whatHappened: "The attacker created a fake request to steal your login credentials.", whyDangerous: "Once attackers have your credentials, they can access your accounts, steal money, or impersonate you.", howToAvoid: "Never click links to log in. Use a password manager and enable two-factor authentication." },
    "Prize Scam": { title: "The Lottery Scam Pattern", whatHappened: "Scammers used the excitement of 'winning' to extract money or personal information.", whyDangerous: "These scams often ask for 'processing fees' that escalate.", howToAvoid: "You can't win a lottery you didn't enter. Delete these messages immediately." },
    "Fear-Based Manipulation": { title: "Recognizing Scare Tactics", whatHappened: "The attacker tried to create panic about your account security.", whyDangerous: "Fear bypasses rational thinking.", howToAvoid: "Contact the company directly using their official website—never through links in the message." },
    "Financial Scam": { title: "Money Transfer Red Flags", whatHappened: "This message tried to get you to send money through hard-to-trace methods.", whyDangerous: "These payment methods are nearly impossible to reverse.", howToAvoid: "Legitimate businesses accept credit cards. Never send gift cards or wire transfers to strangers." },
  };
  return lessons[primary.name] || { title: "Phishing Awareness", whatHappened: `This message used ${primary.name.toLowerCase()} techniques to manipulate you.`, whyDangerous: "Phishing attacks can lead to identity theft and financial loss.", howToAvoid: "Verify senders independently and avoid clicking links in unexpected messages." };
}

function generateRecommendations(categories: ThreatCategory[], score: number): string[] {
  if (score >= 50) {
    return ["🚨 Delete this message immediately", "Do NOT click any links or download attachments", "If you already clicked a link, change your passwords immediately", "Report this to your IT department or school administration", "Enable two-factor authentication on all your accounts", "Monitor your accounts for suspicious activity"];
  }
  if (score >= 20) {
    return ["Proceed with caution—verify the sender's identity", "Do not click any links without verification", "Contact the supposed sender through official channels", "Do not respond to this message", "Report it as spam/phishing to your email provider"];
  }
  return ["This message appears safe, but stay vigilant", "Always verify unexpected requests through separate channels", "Keep your security software updated"];
}

export async function analyzeMessage(input: string): Promise<ThreatAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Analyze URLs in the message
  const urlAnalysis = analyzeURLs(input);

  const detectedCategories: Map<string, ThreatCategory> = new Map();
  let totalScore = 0;

  // Increase threat score if dangerous URLs are found
  const hasUrlThreats = urlAnalysis.some(url => url.riskLevel === "danger");
  const hasUrlWarnings = urlAnalysis.some(url => url.riskLevel === "warning");
  if (hasUrlThreats) totalScore += 30;
  if (hasUrlWarnings) totalScore += 15;

  for (const pattern of threatPatterns) {
    const matches = input.match(pattern.regex);
    if (matches) {
      totalScore += pattern.weight;
      const existing = detectedCategories.get(pattern.category);
      if (existing) {
        existing.indicators.push(...matches);
      } else {
        detectedCategories.set(pattern.category, {
          name: pattern.category, severity: pattern.severity,
          description: `Detected ${pattern.category.toLowerCase()} patterns`, indicators: [...matches],
        });
      }
    }
  }

  const confidenceScore = Math.min(totalScore, 100);
  let riskLevel: "safe" | "warning" | "danger" = "safe";
  if (confidenceScore >= 50) riskLevel = "danger";
  else if (confidenceScore >= 20) riskLevel = "warning";

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const categories = Array.from(detectedCategories.values()).sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const senderVerification = verifySender(input, confidenceScore);

  return {
    riskLevel, confidenceScore, threatCategories: categories,
    aiExplanation: generateAIExplanation(categories, confidenceScore),
    technicalDetails: generateTechnicalDetails(input, categories, urlAnalysis),
    teachBackLesson: generateTeachBackLesson(categories, confidenceScore),
    recommendations: generateRecommendations(categories, confidenceScore),
    senderVerification,
    urlAnalysis: urlAnalysis.length > 0 ? urlAnalysis : undefined,
  };
}
