export function GradientBackground() {
    return (
      <div className="pointer-events-none fixed inset-0">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background animate-fadeIn" />
        
        {/* Floating Blurs */}
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/15 blur-[100px] animate-fadeIn delay-200" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/15 blur-[100px] animate-fadeIn delay-300" />
      </div>
    );
  }
  