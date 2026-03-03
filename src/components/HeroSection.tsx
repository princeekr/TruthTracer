import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const HeroSection = ({ onAnalyze, isLoading }: HeroSectionProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onAnalyze(url.trim());
  };

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center pt-20 pb-12 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.04] blur-[140px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">AI-Powered Verification</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            <span className="text-foreground">Detect Fake News</span>
            <br />
            <span className="gradient-text">Instantly</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-12 leading-relaxed">
            Paste any news article URL and let our AI verify its authenticity in seconds with transparent analysis.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="glass-card p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste article URL here..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm py-3"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Article
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
