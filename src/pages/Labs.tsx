import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Database, Lock, Fish, AlertTriangle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoImage from "@/assets/guarded-ai-logo.png";

const labs = [
  {
    id: "idor",
    title: "IDOR Vulnerabilities",
    description: "Learn about Insecure Direct Object References and how attackers exploit them to access unauthorized resources.",
    icon: Shield,
    difficulty: "Intermediate",
    duration: "45 min",
    learners: "2.3k",
    topics: ["Object References", "Authorization Bypass", "Access Control"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "sql-injection",
    title: "SQL Injection",
    description: "Understand how malicious SQL queries can compromise databases and learn prevention techniques.",
    icon: Database,
    difficulty: "Advanced",
    duration: "60 min",
    learners: "4.1k",
    topics: ["Database Security", "Input Validation", "Parameterized Queries"],
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "access-control",
    title: "Access Control",
    description: "Master authorization mechanisms and learn to identify broken access control vulnerabilities.",
    icon: Lock,
    difficulty: "Intermediate",
    duration: "50 min",
    learners: "3.2k",
    topics: ["RBAC", "Privilege Escalation", "Session Management"],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "phishing",
    title: "Phishing Detection",
    description: "Develop skills to identify and prevent phishing attacks through real-world scenarios and examples.",
    icon: Fish,
    difficulty: "Beginner",
    duration: "30 min",
    learners: "8.7k",
    topics: ["Social Engineering", "Email Analysis", "URL Inspection"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const Labs = () => {
  const navigate = useNavigate();

  const handleStartLab = (labId: string) => {
    navigate(`/labs/${labId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="GuardEd AI" className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="sm">Profile</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Page header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Security Labs</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hands-on interactive labs to learn about common security vulnerabilities. 
              Practice identifying and preventing attacks in a safe environment.
            </p>
          </div>

          {/* Labs grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {labs.map((lab) => (
              <Card key={lab.id} className="glass-card hover:border-primary/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${lab.bgColor}`}>
                      <lab.icon className={`w-6 h-6 ${lab.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {lab.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                    {lab.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {lab.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lab.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lab.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {lab.learners} learners
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleStartLab(lab.id)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Start Lab
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info section */}
          <div className="mt-16 glass-card p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Educational Purpose Only</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These labs are designed for educational purposes to help you understand security vulnerabilities. 
              Never use this knowledge for malicious purposes. Always practice ethical hacking principles.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Labs;
