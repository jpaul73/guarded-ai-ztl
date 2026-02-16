import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  expandedContent?: string;
  delay?: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const FeatureCard = ({ icon: Icon, title, description, expandedContent, delay = 0, isExpanded = false, onToggle }: FeatureCardProps) => {
  return (
    <div
      className="glass-card p-6 group hover:border-primary/50 transition-all duration-300 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => expandedContent && onToggle?.()}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
        {expandedContent && (
          isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground mt-1 shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
        )}
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {isExpanded && expandedContent && (
        <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground leading-relaxed animate-fade-in">
          {expandedContent}
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
