import { useState } from "react";
import { X, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
}

const quickGuides = [
  { title: "How to scan a message", description: "Learn to detect phishing threats" },
  { title: "Understanding risk levels", description: "Safe, Warning, and Danger explained" },
  { title: "Security Labs overview", description: "Hands-on vulnerability training" },
  { title: "Privacy & data handling", description: "How we protect your information" },
  { title: "Dashboard features", description: "Track your security progress" },
  { title: "Profile settings", description: "Customize your learning experience" },
];

const botResponses: Record<string, string> = {
  "how to scan": `Great question! Here's how to scan a message for threats:

**Step 1:** Navigate to the homepage and find the "AI Threat Scanner" section.

**Step 2:** Paste any suspicious content—emails, SMS, URLs, or social media messages—into the text area.

**Step 3:** Click the "Scan for Threats" button.

**Step 4:** Review the detailed analysis showing:
• Overall risk level (Safe/Warning/Danger)
• Specific threat indicators detected
• Recommendations for how to proceed

💡 **Pro tip:** You can also view your scan history to review past analyses!`,

  "risk levels": `Our AI uses three risk levels to classify threats:

🟢 **Safe (Low Risk)**
No threats detected. The message appears legitimate with no suspicious patterns, malicious links, or social engineering tactics.

🟡 **Warning (Medium Risk)**
Some suspicious elements found. This could include:
• Unusual sender addresses
• Urgency language
• Requests for personal information
Proceed with caution and verify through official channels.

🔴 **Danger (High Risk)**
Multiple threat indicators detected:
• Phishing attempts
• Malicious URLs
• Impersonation tactics
• Social engineering patterns
Do NOT click any links or provide information!`,

  "labs": `Our Security Labs provide interactive, hands-on training:

🛡️ **IDOR Vulnerabilities** (Intermediate)
Learn how attackers exploit insecure direct object references to access unauthorized data. Practice identifying and preventing these common flaws.

🗃️ **SQL Injection** (Advanced)
Understand how malicious SQL queries compromise databases. Learn parameterized queries and input validation techniques.

🔐 **Access Control** (Intermediate)
Master authorization mechanisms. Identify broken access control, privilege escalation, and session management issues.

🎣 **Phishing Detection** (Beginner)
Develop skills to spot social engineering attacks. Analyze real-world email examples and learn red flags to watch for.

Each lab includes quizzes to test your knowledge!`,

  "privacy": `GuardEd AI is built with privacy-first principles:

🔒 **No Personal Data Storage**
We don't collect or store any personal information about you.

💻 **Local Processing**
All threat scans are processed locally in your browser—your messages never leave your device.

📱 **Browser-Based History**
Your scan history is stored only in your browser's localStorage. Clear it anytime from the scanner section.

🚫 **No Tracking**
We don't use cookies, analytics trackers, or any third-party data collection.

✅ **Your Data, Your Control**
Everything stays on your device. You're always in control.`,

  "dashboard": `The Dashboard is your security command center:

📊 **Scan Statistics**
Track your total scans and see breakdowns by risk level (Safe, Warning, Danger).

📈 **Activity Overview**
View your recent scanning activity and identify patterns in the threats you've encountered.

🏆 **Lab Progress**
See which security labs you've completed and track your learning journey.

🕐 **Recent Threats**
Quick access to your latest scan results for easy reference.

Visit /dashboard to see your personalized security insights!`,

  "profile": `Your Profile page lets you personalize your experience:

✏️ **Editable Information**
Click "Edit Profile" to update your display name and email address. Changes are saved locally.

🏅 **Achievements**
Track your security learning milestones:
• First Scan - Complete your first threat scan
• Phishing Expert - Complete the Phishing Detection lab
• Security Rookie - Scan 10 messages
• And more to unlock!

📊 **Progress Stats**
See your total scans, completed labs, and earned achievements at a glance.

🔐 **Privacy**
All your profile data stays in your browser—we never send it anywhere.`,

  "getting started": `Welcome to GuardEd AI! Here's how to get started:

**1. Try the AI Threat Scanner** 🔍
Paste any suspicious message on the homepage and click "Scan for Threats" to see our AI in action.

**2. Explore Security Labs** 📚
Visit /labs to take interactive quizzes on IDOR, SQL Injection, Access Control, and Phishing.

**3. Track Your Progress** 📊
Check /dashboard to see your scan statistics and lab completion.

**4. Customize Your Profile** 👤
Visit /profile to set your name and track achievements.

**Need help?** Just ask me anything about cybersecurity or how to use this platform!`,

  default: `Hello! I'm your GuardEd AI assistant 🤖

I'm here to help you navigate the platform and learn about cybersecurity. Here's what I can help with:

🔍 **Threat Scanning** - How to analyze suspicious messages
📊 **Risk Levels** - Understanding Safe, Warning, and Danger ratings
🎓 **Security Labs** - Interactive training on vulnerabilities
📈 **Dashboard** - Tracking your security progress
👤 **Profile** - Managing your account and achievements
🔒 **Privacy** - How we protect your data

Just type your question or click one of the quick guides below!

What would you like to learn about today?`,
};

const TutorialChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "👋 Hi! I'm your GuardEd AI assistant. I can help you learn how to use this platform and stay safe online. What would you like to know?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("scan") || lowerMessage.includes("analyze") || lowerMessage.includes("check") || lowerMessage.includes("detect")) {
      return botResponses["how to scan"];
    }
    if (lowerMessage.includes("risk") || lowerMessage.includes("level") || lowerMessage.includes("safe") || lowerMessage.includes("danger") || lowerMessage.includes("warning")) {
      return botResponses["risk levels"];
    }
    if (lowerMessage.includes("lab") || lowerMessage.includes("idor") || lowerMessage.includes("sql") || lowerMessage.includes("injection") || lowerMessage.includes("access control") || lowerMessage.includes("phishing")) {
      return botResponses["labs"];
    }
    if (lowerMessage.includes("privacy") || lowerMessage.includes("data") || lowerMessage.includes("secure") || lowerMessage.includes("protect")) {
      return botResponses["privacy"];
    }
    if (lowerMessage.includes("dashboard") || lowerMessage.includes("stats") || lowerMessage.includes("statistics") || lowerMessage.includes("progress")) {
      return botResponses["dashboard"];
    }
    if (lowerMessage.includes("profile") || lowerMessage.includes("account") || lowerMessage.includes("achievement") || lowerMessage.includes("badge") || lowerMessage.includes("setting")) {
      return botResponses["profile"];
    }
    if (lowerMessage.includes("start") || lowerMessage.includes("begin") || lowerMessage.includes("how to use") || lowerMessage.includes("getting started") || lowerMessage.includes("help")) {
      return botResponses["getting started"];
    }
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! 👋 Great to see you here! I'm ready to help you learn about cybersecurity. What would you like to know? You can ask about scanning messages, security labs, or how to use any feature!";
    }
    if (lowerMessage.includes("thank")) {
      return "You're welcome! 😊 I'm always here if you have more questions about cybersecurity or using the platform. Stay safe online! 🔐";
    }
    return botResponses["default"];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(input),
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleQuickGuide = (guide: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: guide,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(guide),
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button - Robot Face */}
      <button
        onClick={() => setIsOpen(true)}
         className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 pl-4 pr-3 py-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform glow-border ${isOpen ? "hidden" : ""}`}
      >
         <span className="text-sm font-medium">Need help?</span>
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          {/* Robot head */}
          <rect x="4" y="6" width="16" height="14" rx="3" fill="currentColor" opacity="0.9"/>
          {/* Antenna */}
          <rect x="11" y="2" width="2" height="4" rx="1" fill="currentColor"/>
          <circle cx="12" cy="2" r="2" fill="currentColor"/>
          {/* Left eye */}
          <circle cx="8.5" cy="12" r="2" fill="hsl(var(--background))"/>
          <circle cx="8.5" cy="12" r="1" fill="hsl(var(--primary))"/>
          {/* Right eye */}
          <circle cx="15.5" cy="12" r="2" fill="hsl(var(--background))"/>
          <circle cx="15.5" cy="12" r="1" fill="hsl(var(--primary))"/>
          {/* Mouth */}
          <rect x="8" y="16" width="8" height="2" rx="1" fill="hsl(var(--background))"/>
          {/* Mouth lines */}
          <rect x="9" y="16" width="1" height="2" fill="hsl(var(--primary))" opacity="0.5"/>
          <rect x="11.5" y="16" width="1" height="2" fill="hsl(var(--primary))" opacity="0.5"/>
          <rect x="14" y="16" width="1" height="2" fill="hsl(var(--primary))" opacity="0.5"/>
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] glass-card flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                  <rect x="4" y="6" width="16" height="14" rx="3"/>
                  <rect x="11" y="2" width="2" height="4" rx="1"/>
                  <circle cx="12" cy="2" r="2"/>
                  <circle cx="8.5" cy="12" r="1.5" fill="hsl(var(--background))"/>
                  <circle cx="15.5" cy="12" r="1.5" fill="hsl(var(--background))"/>
                  <rect x="8" y="16" width="8" height="1.5" rx="0.75" fill="hsl(var(--background))"/>
                </svg>
              </div>
              <div>
                <span className="font-semibold text-foreground text-sm">GuardEd Assistant</span>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-line ${
                      msg.isBot
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Guides */}
            {messages.length === 1 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Quick guides:</p>
                {quickGuides.map((guide) => (
                  <button
                    key={guide.title}
                    onClick={() => handleQuickGuide(guide.title)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{guide.title}</p>
                      <p className="text-xs text-muted-foreground">{guide.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-input border-border"
              />
              <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorialChatbox;
