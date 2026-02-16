import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Fish, Users, Server, Wifi, Fingerprint, Clock, BookOpen, AlertTriangle, CheckCircle, Play, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import logoImage from "@/assets/guarded-ai-logo.png";

const topics = [
  {
    id: "consent-identity",
    title: "Consent-First Identity/Fraud Signals",
    description: "Understand how modern identity verification balances fraud detection with user privacy through transparent, consent-based data collection.",
    icon: Fingerprint,
    difficulty: "Intermediate",
    duration: "25 min",
    keyPoints: ["Privacy-first approach", "Fraud signal types", "User consent", "Data minimization"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    xp: 250,
  },
  {
    id: "phishing",
    title: "Phishing Attacks",
    description: "Learn how attackers use deceptive emails, websites, and messages to steal sensitive information like passwords and credit card details.",
    icon: Fish,
    difficulty: "Beginner",
    duration: "20 min",
    keyPoints: ["Email spoofing", "Fake websites", "Credential harvesting", "Spear phishing"],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    xp: 150,
  },
  {
    id: "social-engineering",
    title: "Social Engineering",
    description: "Understand psychological manipulation techniques used to trick people into revealing confidential information or performing actions.",
    icon: Users,
    difficulty: "Intermediate",
    duration: "30 min",
    keyPoints: ["Pretexting", "Baiting", "Tailgating", "Quid pro quo"],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    xp: 300,
  },
  {
    id: "dos",
    title: "Denial of Service (DoS)",
    description: "Discover how attackers overwhelm systems with traffic to make services unavailable, and learn about DDoS attack variations.",
    icon: Server,
    difficulty: "Intermediate",
    duration: "25 min",
    keyPoints: ["Flooding attacks", "DDoS botnets", "Resource exhaustion", "Amplification attacks"],
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    xp: 300,
  },
  {
    id: "mitm",
    title: "Man in the Middle",
    description: "Learn how attackers intercept communications between two parties to eavesdrop or alter data without detection.",
    icon: Wifi,
    difficulty: "Advanced",
    duration: "35 min",
    keyPoints: ["Session hijacking", "SSL stripping", "ARP spoofing", "Evil twin attacks"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    xp: 400,
  },
];

const difficultyColor: Record<string, string> = {
  Beginner: "bg-primary/20 text-primary border-primary/30",
  Intermediate: "bg-warning/20 text-warning border-warning/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

const Learn = () => {
  const navigate = useNavigate();
  const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
  const totalXP = topics.filter(t => completedLessons.includes(t.id)).reduce((sum, t) => sum + t.xp, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="GuardEd AI" className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/labs"><Button variant="ghost" size="sm">Labs</Button></Link>
            <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            <Link to="/profile"><Button variant="ghost" size="sm">Profile</Button></Link>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Page header with stats */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="gradient-text">Learning Paths</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Master cybersecurity through hands-on modules and video tutorials.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="glass-card px-4 py-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                  <p className="text-lg font-bold text-foreground">{totalXP}</p>
                </div>
              </div>
              <div className="glass-card px-4 py-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-lg font-bold text-foreground">{completedLessons.length}/{topics.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall progress */}
          <div className="glass-card p-4 mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-primary font-medium">{Math.round((completedLessons.length / topics.length) * 100)}%</span>
            </div>
            <Progress value={(completedLessons.length / topics.length) * 100} className="h-3" />
          </div>

          {/* Topics grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic) => {
              const isCompleted = completedLessons.includes(topic.id);
              return (
                <Card
                  key={topic.id}
                  className={`glass-card hover:border-primary/50 transition-all duration-300 group cursor-pointer ${isCompleted ? 'border-primary/30' : ''}`}
                  onClick={() => navigate(`/learn/${topic.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${topic.bgColor} border ${topic.borderColor}`}>
                        <topic.icon className={`w-6 h-6 ${topic.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs border ${difficultyColor[topic.difficulty]}`}>
                          {topic.difficulty}
                        </Badge>
                        {isCompleted && (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {topic.keyPoints.map((point) => (
                        <span key={point} className="text-xs px-2 py-1 rounded-full bg-secondary/80 text-secondary-foreground border border-border/30">
                          {point}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{topic.duration}</span>
                        <span className="flex items-center gap-1"><Play className="w-4 h-4" />Video</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />10 sections</span>
                      </div>
                      <span className="flex items-center gap-1 text-warning font-medium">
                        <Trophy className="w-4 h-4" />{topic.xp} XP
                      </span>
                    </div>

                    <Button
                      className={`w-full ${
                        isCompleted
                          ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {isCompleted ? (
                        <><CheckCircle className="w-4 h-4 mr-2" />Review Lesson</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" />Start Learning</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info section */}
          <div className="mt-16 glass-card p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Knowledge is Your Best Defense</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each path includes video tutorials, detailed reading material, and hands-on exercises. Complete all paths to earn your cybersecurity awareness badge.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
