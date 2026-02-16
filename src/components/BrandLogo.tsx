import logoImage from "@/assets/guarded-ai-logo.png";

interface BrandLogoProps {
  size?: "small" | "default" | "large";
  showText?: boolean;
}

const BrandLogo = ({ size = "default", showText = false }: BrandLogoProps) => {
  const sizeClasses = {
    small: "h-8",
    default: "h-10",
    large: "h-24",
  };

  return (
    <div className="flex items-center gap-3">
      <img 
        src={logoImage} 
        alt="GuardEd AI Logo" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg text-foreground">
            Guard<span className="text-primary">Ed</span> AI
          </span>
          <span className="text-xs text-muted-foreground">Safer digital habits, explained.</span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
