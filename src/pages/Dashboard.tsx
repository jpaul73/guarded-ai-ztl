import { Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import logoImage from "@/assets/guarded-ai-logo.png";

 const allLabs = [
   { id: "idor", name: "IDOR Vulnerabilities" },
   { id: "sql-injection", name: "SQL Injection" },
   { id: "access-control", name: "Access Control" },
   { id: "phishing", name: "Phishing Detection" },
 ];

const Dashboard = () => {
   // Get scan history from localStorage
   const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
   const completedLabs = JSON.parse(localStorage.getItem('completedLabs') || '[]');
   const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
 
   // Calculate stats from real data
   const totalScans = scanHistory.length;
   const threatsDetected = scanHistory.filter((s: any) => s.riskLevel === 'danger' || s.riskLevel === 'warning').length;
   const safeMessages = scanHistory.filter((s: any) => s.riskLevel === 'safe').length;
   const labsCompleted = completedLabs.length;
 
   const stats = [
     { label: "Total Scans", value: totalScans.toString(), icon: Shield, change: totalScans > 0 ? "active" : "start scanning", color: "text-primary" },
     { label: "Threats Detected", value: threatsDetected.toString(), icon: AlertTriangle, change: `${totalScans > 0 ? Math.round((threatsDetected / totalScans) * 100) : 0}%`, color: "text-warning" },
     { label: "Safe Messages", value: safeMessages.toString(), icon: CheckCircle, change: `${totalScans > 0 ? Math.round((safeMessages / totalScans) * 100) : 0}%`, color: "text-primary" },
     { label: "Labs Completed", value: `${labsCompleted}/${allLabs.length}`, icon: Target, change: `${Math.round((labsCompleted / allLabs.length) * 100)}%`, color: "text-blue-400" },
   ];
 
   // Get recent scans (last 4)
   const recentScans = scanHistory.slice(0, 4).map((scan: any, index: number) => ({
     id: index,
     preview: scan.content?.substring(0, 50) + (scan.content?.length > 50 ? '...' : '') || 'Unknown content',
     risk: scan.riskLevel || 'safe',
     time: getTimeAgo(new Date(scan.timestamp)),
   }));
 
   // Calculate lab progress
   const labProgress = allLabs.map(lab => ({
     name: lab.name,
     progress: completedLabs.includes(lab.id) ? 100 : 0,
     status: completedLabs.includes(lab.id) ? 'completed' : 'not-started',
   }));
 
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "danger": return "text-destructive";
      case "warning": return "text-warning";
      default: return "text-primary";
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case "danger": return "bg-destructive/10";
      case "warning": return "bg-warning/10";
      default: return "bg-primary/10";
    }
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
            <Link to="/labs">
              <Button variant="ghost" size="sm">Labs</Button>
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Track your security learning progress and scan activity
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-xs text-primary flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Scans */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Scans
                </CardTitle>
                <CardDescription>Your latest threat analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                 {recentScans.length > 0 ? (
                   <div className="space-y-3">
                  {recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${getRiskBg(scan.risk)} ${getRiskColor(scan.risk)}`}>
                        <div className={`w-2 h-2 rounded-full ${scan.risk === 'danger' ? 'bg-destructive' : scan.risk === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{scan.preview}</p>
                        <p className="text-xs text-muted-foreground">{scan.time}</p>
                      </div>
                      <span className={`text-xs font-medium capitalize ${getRiskColor(scan.risk)}`}>
                        {scan.risk}
                      </span>
                    </div>
                  ))}
                </div>
                 ) : (
                   <div className="text-center py-8 text-muted-foreground">
                     <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                     <p>No scans yet</p>
                     <p className="text-sm">Start scanning messages to see your history here</p>
                   </div>
                 )}
                <Link to="/#scanner">
                  <Button variant="outline" className="w-full mt-4">
                    View All Scans
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Lab Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Lab Progress
                </CardTitle>
                <CardDescription>Your security training journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labProgress.map((lab) => (
                    <div key={lab.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{lab.name}</span>
                        <span className="text-muted-foreground">{lab.progress}%</span>
                      </div>
                      <Progress value={lab.progress} className="h-2" />
                    </div>
                  ))}
                </div>
                <Link to="/labs">
                  <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                    Continue Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

 // Helper function to get relative time
 function getTimeAgo(date: Date): string {
   const now = new Date();
   const diffMs = now.getTime() - date.getTime();
   const diffMins = Math.floor(diffMs / 60000);
   const diffHours = Math.floor(diffMs / 3600000);
   const diffDays = Math.floor(diffMs / 86400000);
 
   if (diffMins < 1) return 'just now';
   if (diffMins < 60) return `${diffMins} min ago`;
   if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
   return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
 }
 
export default Dashboard;
