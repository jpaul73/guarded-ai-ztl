import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Shield, Award, Calendar, Edit2, Save, X, Users, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/guarded-ai-logo.png";

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
}

interface AdminUser {
  username: string | null;
  email: string | null;
  total_scans: number;
  labs_completed: string[] | null;
  created_at: string;
}

const ADMIN_EMAIL = "doniyal123@gmail.com";
const ADMIN_USERNAME = "doniyal";

const isAdminUser = (name: string, email: string) => {
  return name?.toLowerCase().trim() === ADMIN_USERNAME && email?.trim().toLowerCase() === ADMIN_EMAIL;
};

const achievements = [
  { id: 1, title: "First Scan", description: "Completed your first threat scan", icon: Shield, earned: true },
  { id: 2, title: "Phishing Expert", description: "Completed the Phishing Detection lab", icon: Award, earned: true },
  { id: 3, title: "Security Rookie", description: "Scanned 10 messages", icon: Shield, earned: true },
  { id: 4, title: "Lab Master", description: "Complete all 4 security labs", icon: Award, earned: false },
  { id: 5, title: "Threat Hunter", description: "Detect 50 threats", icon: Shield, earned: false },
  { id: 6, title: "Security Champion", description: "Scan 100 messages", icon: Award, earned: false },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    joinDate: "",
  });
  const [editForm, setEditForm] = useState<UserProfile>(profile);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "bug" | "feedback" | "praise">("feedback");
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("guarded-user-profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setEditForm(parsed);

      // Check admin
      if (isAdminUser(parsed.name, parsed.email)) {
        setIsAdmin(true);
        fetchAllUsers(parsed.email);
      }
    }
  }, []);

  const fetchAllUsers = async (email: string) => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        body: { email },
      });
      if (error) throw error;
      if (data?.users) setAdminUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setProfile(editForm);
    localStorage.setItem("guarded-user-profile", JSON.stringify(editForm));
    setIsEditing(false);
    toast.success("Profile updated successfully!");

    // Re-check admin status
    if (isAdminUser(editForm.name, editForm.email)) {
      setIsAdmin(true);
      fetchAllUsers(editForm.email);
    } else {
      setIsAdmin(false);
      setAdminUsers([]);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackTitle.trim() || !feedbackMessage.trim()) {
      toast.error("Please fill in title and feedback message");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const { error } = await (supabase as any).from("user_feedback").insert({
        user_id: profile.email || "anonymous",
        user_name: profile.name || "Unknown",
        user_email: profile.email || "unknown@example.com",
        feedback_type: feedbackType,
        title: feedbackTitle,
        message: feedbackMessage,
        rating: feedbackRating,
      });

      if (error) {
        toast.error("Failed to submit feedback");
        console.error(error);
      } else {
        toast.success("Thank you for your feedback!");
        setFeedbackTitle("");
        setFeedbackMessage("");
        setFeedbackType("feedback");
        setFeedbackRating(5);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred while submitting feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            <Link to="/labs"><Button variant="ghost" size="sm">Labs</Button></Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Profile Card */}
          <Card className="glass-card mb-8">
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {getInitials(profile.name || "U")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left w-full">
                  {isEditing ? (
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Enter your name" className="bg-input border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Enter your email" className="bg-input border-border" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm" className="bg-primary text-primary-foreground">
                          <Save className="w-4 h-4 mr-2" />Save Changes
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-foreground mb-1">{profile.name}</h1>
                      <p className="text-muted-foreground mb-4">{profile.email}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Shield className="w-3 h-3 mr-1" />
                          {isAdmin ? "Admin" : "Security Learner"}
                        </Badge>
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {profile.joinDate}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Panel */}
          {isAdmin && (
            <Card className="glass-card mb-8 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Admin — All Users
                </CardTitle>
                <CardDescription>View all registered user profiles from the database</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <p className="text-muted-foreground text-center py-4">Loading users...</p>
                ) : adminUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Username</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Total Scans</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Labs Done</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((user, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-2 px-3 text-foreground">{user.username || "—"}</td>
                            <td className="py-2 px-3 text-foreground">{user.email || "—"}</td>
                            <td className="py-2 px-3 text-foreground">{user.total_scans}</td>
                            <td className="py-2 px-3 text-foreground">{user.labs_completed?.length || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No users in the database yet</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Achievements
              </CardTitle>
              <CardDescription>Track your security learning milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      achievement.earned ? "bg-primary/10 border border-primary/30" : "bg-secondary/30 opacity-60"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${achievement.earned ? "bg-primary/20" : "bg-secondary"}`}>
                      <achievement.icon className={`w-5 h-5 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <Badge className="ml-auto bg-primary/20 text-primary border-0">Earned</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Share Your Feedback
              </CardTitle>
              <CardDescription>Help us improve GuardEd AI with your suggestions and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Feedback Type */}
                <div>
                  <Label htmlFor="feedback-type" className="text-foreground mb-2 block">Feedback Type</Label>
                  <select
                    id="feedback-type"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="feedback">General Feedback</option>
                    <option value="bug">Report a Bug</option>
                    <option value="suggestion">Feature Suggestion</option>
                    <option value="praise">Praise</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="feedback-title" className="text-foreground mb-2 block">Subject</Label>
                  <Input
                    id="feedback-title"
                    placeholder="Brief subject of your feedback"
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="feedback-message" className="text-foreground mb-2 block">Message</Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Describe your feedback, bug report, or suggestion in detail..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    rows={4}
                    className="bg-secondary border-border resize-none"
                  />
                </div>

                {/* Rating */}
                <div>
                  <Label className="text-foreground mb-2 block">Rate Your Experience</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= feedbackRating ? "text-yellow-400" : "text-muted-foreground"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy notice */}
          <div className="mt-8 p-4 rounded-lg bg-secondary/30 text-center">
            <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Your data stays private. All progress is stored locally in your browser.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
