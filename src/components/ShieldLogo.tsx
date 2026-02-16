import { Shield, Lock, GraduationCap } from "lucide-react";

const ShieldLogo = ({ size = "default" }: { size?: "default" | "large" }) => {
  const isLarge = size === "large";
  
  return (
    <div className={`relative ${isLarge ? 'w-32 h-36' : 'w-10 h-12'} animate-float`}>
      {/* Glow effect behind shield */}
      <div className={`absolute inset-0 bg-primary/20 blur-2xl rounded-full ${isLarge ? 'scale-150' : 'scale-125'}`} />
      
      {/* Main shield */}
      <div className="relative w-full h-full">
        <Shield 
          className={`w-full h-full text-primary drop-shadow-lg ${isLarge ? 'animate-pulse-glow' : ''}`}
          strokeWidth={1.5}
          fill="hsl(var(--primary) / 0.1)"
        />
        
        {/* Lock icon - left side */}
        <div className={`absolute ${isLarge ? 'left-3 top-10' : 'left-1 top-3'}`}>
          <Lock 
            className={`${isLarge ? 'w-5 h-5' : 'w-2 h-2'} text-foreground/80`}
            strokeWidth={2}
          />
        </div>
        
        {/* Graduation cap - right side */}
        <div className={`absolute ${isLarge ? 'right-3 top-10' : 'right-1 top-3'}`}>
          <GraduationCap 
            className={`${isLarge ? 'w-5 h-5' : 'w-2 h-2'} text-foreground/80`}
            strokeWidth={2}
          />
        </div>
        
        {/* AI circuit pattern in center */}
        <div className={`absolute inset-0 flex items-center justify-center ${isLarge ? 'mt-4' : 'mt-1'}`}>
          <div className={`grid grid-cols-2 gap-0.5 ${isLarge ? 'w-8 h-8' : 'w-2 h-2'}`}>
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className={`${isLarge ? 'w-3 h-3' : 'w-0.5 h-0.5'} bg-primary/60 rounded-sm`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShieldLogo;
