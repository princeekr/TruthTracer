import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-20 text-center"
  >
    <div className="glass-card inline-flex flex-col items-center gap-6 px-12 py-10">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">Analyzing article using AI…</p>
        <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
      </div>
      <div className="w-48 h-1 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-primary shimmer rounded-full" style={{ width: "60%" }} />
      </div>
    </div>
  </motion.div>
);

export default LoadingState;
