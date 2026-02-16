import { useState } from "react";
import { Shield, Brain, Eye, Lock, BookOpen, BarChart3 } from "lucide-react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const features = [
    {
      icon: Shield,
      title: "Real-Time Threat Detection",
      description: "Instantly analyze emails, SMS, and URLs for phishing attempts, malware links, and social engineering tactics.",
      expandedContent: "GuardEd AI uses advanced pattern matching and heuristic analysis to evaluate incoming messages in real time. It checks for known phishing indicators such as spoofed sender addresses, suspicious URL structures, urgency-based language, and embedded tracking pixels. The system also cross-references domains against a continuously updated threat intelligence database, identifying newly registered domains and typosquatting attempts. Every scan provides a detailed risk score alongside a human-readable explanation, empowering users to understand the threat landscape without needing prior cybersecurity expertise. Results are displayed instantly so you can make informed decisions before clicking any link or responding to any message."
    },
    {
      icon: Brain,
      title: "Explainable AI",
      description: "Understand exactly why something is flagged as dangerous with clear, jargon-free explanations.",
      expandedContent: "Unlike black-box security tools that simply say 'blocked,' GuardEd AI breaks down every detection into understandable components. Each flagged message comes with a transparency report showing which specific elements triggered the alert—whether it's a mismatched sender domain, suspicious attachment type, manipulative language pattern, or a redirect chain in the URL. The system assigns confidence percentages to each indicator and ranks them by severity. This approach not only builds trust but also serves as an educational tool, teaching users to recognize threat patterns independently over time. Our explainability framework follows NIST guidelines for AI transparency in cybersecurity applications."
    },
    {
      icon: BookOpen,
      title: "Teach-Back Learning",
      description: "Short, interactive lessons that reinforce why threats are dangerous and how to avoid them next time.",
      expandedContent: "The Teach-Back methodology is grounded in cognitive science research showing that active recall dramatically improves knowledge retention. After each threat detection, GuardEd AI presents a micro-lesson explaining the attack vector, its real-world impact, and defensive strategies. Users then answer scenario-based questions to confirm understanding. The system tracks learning progress across five domains—phishing, social engineering, denial of service, man-in-the-middle attacks, and identity protection. Each learning path contains 10 progressive sections that build from fundamentals to advanced defense techniques, ensuring comprehensive cybersecurity literacy for students of all backgrounds."
    },
    {
      icon: Lock,
      title: "Privacy-Preserving",
      description: "No personal data stored. All analysis happens in-session with hashing and anonymization.",
      expandedContent: "Privacy is not an afterthought—it's the foundation of GuardEd AI's architecture. All message analysis occurs within your browser session, meaning raw text never leaves your device for storage. When threat data is processed, content is immediately hashed using SHA-256 before any aggregation occurs. User identities are decoupled from scan results through cryptographic anonymization, making it mathematically impossible to trace threat reports back to individuals. The platform complies with FERPA, GDPR, and COPPA regulations, ensuring that educational institutions can deploy it without compromising student privacy. Session data is automatically purged when you close your browser."
    },
    {
      icon: Eye,
      title: "Consent-First Scanning",
      description: "You decide what gets scanned. Full transparency about what the AI sees and does.",
      expandedContent: "GuardEd AI operates on an explicit opt-in model. Nothing is scanned automatically—you choose exactly which messages, emails, or URLs to analyze. Before each scan, the system clearly displays what data will be processed and how results will be used. There are no background monitoring agents, no email integration hooks, and no persistent browser extensions collecting data silently. This consent-first approach respects user autonomy and aligns with ethical AI principles. Users maintain complete control over their data at all times, with the ability to clear scan history instantly. Every interaction is logged transparently in your local session for your review."
    },
    {
      icon: BarChart3,
      title: "Anonymous Insights",
      description: "Institutions get aggregated threat intelligence without exposing individual user data.",
      expandedContent: "Educational institutions benefit from aggregate threat intelligence dashboards that reveal campus-wide attack trends without compromising individual privacy. GuardEd AI uses differential privacy techniques to generate statistical reports—showing patterns like 'phishing attempts increased 40% this week targeting .edu domains' without revealing which specific users were targeted. Administrators can identify emerging threat campaigns, allocate security training resources effectively, and benchmark their institution's security posture against anonymized national averages. All institutional reports undergo k-anonymity verification to ensure no individual can be identified from the aggregated data, meeting the highest standards of educational data protection."
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">How GuardEd AI Protects You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combining cutting-edge AI with privacy-first principles to create a safer digital experience for students.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              expandedContent={feature.expandedContent}
              delay={index * 100}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
