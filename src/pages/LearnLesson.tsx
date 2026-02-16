import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import logoImage from "@/assets/guarded-ai-logo.png";
import { lessonContent } from "@/data/learnContent";

const LearnLesson = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const lesson = topicId ? lessonContent[topicId] : null;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Link to="/learn">
            <Button>Back to Learn</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = lesson.icon;
  const totalSections = lesson.sections.length;
  const progress = ((completedSections.length) / totalSections) * 100;

  const handleNext = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    if (!completed.includes(topicId)) {
      completed.push(topicId);
      localStorage.setItem('completedLessons', JSON.stringify(completed));
    }
    navigate('/learn');
  };

  const currentContent = lesson.sections[currentSection];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="GuardEd AI" className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/learn"><Button variant="ghost" size="sm">Learn</Button></Link>
            <Link to="/labs"><Button variant="ghost" size="sm">Labs</Button></Link>
            <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            <Link to="/profile"><Button variant="ghost" size="sm">Profile</Button></Link>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/learn" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Learn
          </Link>

          {/* Lesson header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-xl ${lesson.bgColor}`}>
              <Icon className={`w-8 h-8 ${lesson.color}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{lesson.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{totalSections} sections</span>
              </div>
            </div>
          </div>

          {/* Video Section */}
          {lesson.videoId && (
            <div className="mb-8">
              <div className="glass-card overflow-hidden rounded-xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                  <Play className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Video Tutorial</span>
                </div>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${lesson.videoId}`}
                    title={`${lesson.title} Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Section navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {lesson.sections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentSection === index
                    ? 'bg-primary text-primary-foreground'
                    : completedSections.includes(index)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {completedSections.includes(index) && <CheckCircle className="w-4 h-4" />}
                <span className="text-sm">Section {index + 1}</span>
              </button>
            ))}
          </div>

          {/* Content card */}
          <Card className="glass-card mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">{currentContent.title}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{currentContent.content}</p>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary mb-1">💡 Key Takeaway</p>
                <p className="text-foreground">{currentContent.keyTakeaway}</p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentSection === 0} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
            {currentSection === totalSections - 1 ? (
              <Button onClick={handleComplete} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <CheckCircle className="w-4 h-4" /> Complete Lesson
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnLesson;
