import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Brain, BookOpen, Target, Users, Lock, Zap, Award, ChevronRight } from "lucide-react";

interface GuardEdAIModalProps {
  children: React.ReactNode;
}

const GuardEdAIModal = ({ children }: GuardEdAIModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <span className="gradient-text">About GuardEd AI</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Your comprehensive cybersecurity education platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Introduction */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              What is GuardEd AI?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              GuardEd AI is an innovative cybersecurity education platform designed to empower individuals and organizations 
              with the knowledge and skills needed to navigate today's complex digital threat landscape. We combine 
              cutting-edge AI technology with proven educational methodologies to create an engaging, effective learning 
              experience that transforms how people understand and respond to cyber threats.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform addresses the critical gap between traditional security awareness training and the sophisticated 
              threats that individuals face daily. Rather than presenting dry, technical content, GuardEd AI uses 
              interactive simulations, real-world scenarios, and personalized learning paths to build genuine security 
              intuition that protects users in their personal and professional lives.
            </p>
          </section>

          {/* Mission */}
          <section className="p-6 rounded-xl bg-primary/5 border border-primary/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Our Mission
            </h3>
            <p className="text-foreground leading-relaxed">
              To democratize cybersecurity education by making advanced threat detection and prevention knowledge 
              accessible to everyone—regardless of technical background. We believe that cybersecurity shouldn't be 
              the exclusive domain of IT professionals; it's a fundamental digital literacy skill that every 
              internet user needs in today's interconnected world.
            </p>
          </section>

          {/* Core Features */}
          <section>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Core Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  AI-Powered Threat Scanner
                </h4>
                <p className="text-sm text-muted-foreground">
                  Analyze messages, emails, and URLs in real-time to identify phishing attempts, social engineering 
                  tactics, and other malicious content. Our AI provides detailed explanations of detected threats, 
                  helping users understand not just what to avoid, but why.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  Interactive Learning Paths
                </h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive educational modules covering phishing, social engineering, denial of service attacks, 
                  man-in-the-middle attacks, and identity protection. Each topic features in-depth lessons with 
                  practical examples and key takeaways.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  Hands-On Security Labs
                </h4>
                <p className="text-sm text-muted-foreground">
                  Practice identifying and defending against real-world vulnerabilities including IDOR, SQL injection, 
                  and access control flaws. Our labs combine theoretical quizzes with practical exercises that 
                  simulate actual attack scenarios.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Progress Tracking
                </h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your learning journey with detailed dashboards tracking completed lessons, lab scores, 
                  threat scans, and overall security proficiency. Set goals and earn achievements as you build 
                  your cybersecurity knowledge.
                </p>
              </div>
            </div>
          </section>

          {/* Educational Approach */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Our Educational Approach
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-foreground">Teach-Back Methodology:</strong> GuardEd AI doesn't just tell you 
                what to do—it explains the "why" behind every recommendation. When our threat scanner identifies a 
                phishing attempt, it provides a detailed breakdown of the red flags, helping you develop the intuition 
                to recognize similar threats independently.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Scenario-Based Learning:</strong> Our educational content is built 
                around realistic scenarios that mirror the threats users face in their daily digital lives. From 
                suspicious emails to social engineering calls, we prepare you for the actual situations you'll encounter.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Progressive Difficulty:</strong> Learning paths are structured to 
                build knowledge incrementally, starting with foundational concepts and advancing to sophisticated 
                attack techniques and defense strategies. Users can learn at their own pace while ensuring comprehensive coverage.
              </p>
            </div>
          </section>

          {/* Privacy Commitment */}
          <section className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Privacy-First Design
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We practice what we teach. GuardEd AI is built with privacy as a core principle:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span>No personal data collection beyond what's necessary for platform functionality</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span>Threat scans are processed without storing the analyzed content</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span>Anonymous usage analytics to improve the platform without identifying individuals</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span>Local storage options for users who prefer to keep data on their devices</span>
              </li>
            </ul>
          </section>

          {/* Who It's For */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Who Is GuardEd AI For?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-2">Individuals</h4>
                <p className="text-sm text-muted-foreground">
                  Anyone who uses the internet and wants to protect themselves and their families from online threats.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-medium mb-2">Students</h4>
                <p className="text-sm text-muted-foreground">
                  Learners pursuing cybersecurity education or building digital literacy skills for the modern workforce.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="font-medium mb-2">Organizations</h4>
                <p className="text-sm text-muted-foreground">
                  Companies looking to improve employee security awareness and reduce human-factor vulnerabilities.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center p-6 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
            <h3 className="text-xl font-semibold mb-2">Ready to Start Your Security Journey?</h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of users building their cybersecurity skills with GuardEd AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-primary text-primary-foreground">
                Try Threat Scanner
              </Button>
              <Button variant="outline">
                Explore Learn Path
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuardEdAIModal;
